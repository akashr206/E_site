import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { useAuth } from "../../Contexts/AuthContext";
import {
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { API_URL } from "../../config/api";

const ReviewSection = ({ productId, fetchRatings }) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userReview, setUserReview] = useState({ rating: 5, comment: "" });
    const [submitting, setSubmitting] = useState(false);
    const [reviewOpen, setReviewOpen] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const handleRatingChange = (newRating) => {
        setUserReview({ ...userReview, rating: newRating });
    };

    const handleCommentChange = (e) => {
        setUserReview({ ...userReview, comment: e.target.value });
    };

    const fetchReviews = async () => {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/reviews/${productId}`);
        if (res.ok) {
            const data = await res.json();
            setReviews(data);
        }
        setLoading(false);
    };

    const addReview = async () => {
        const res = await fetch(`${API_URL}/api/reviews`, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
                user: {
                    name: user.name || "Anonymous User",
                    image:
                        user.image ||
                        "https://randomuser.me/api/portraits/lego/1.jpg",
                },
                product: productId,
                rating: userReview.rating,
                comment: userReview.comment,
            }),
        });
        if (res.status == 201) {
            toast.success("Review added successfully");
            fetchReviews();
            setReviewOpen(false);
            setSubmitting(false);
            setUserReview({ rating: 5, comment: "" });
            fetchRatings();
            return;
        } else if (res.status == 400) {
            const { message } = await res.json();
            toast.error(message);
        } else {
            toast.error("Failed to add review, try again later");
        }
        setSubmitting(false);
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error("You must be logged in to submit a review");
            return;
        }

        if (userReview.comment.trim().length < 10) {
            toast.error(
                "Please provide a more detailed review (at least 10 characters)"
            );
            return;
        }

        if (userReview.comment.trim().length > 350) {
            toast.error(
                "Please provide a review that is less than 350 characters"
            );
            return;
        }

        setSubmitting(true);
        addReview();
    };
    const averageRating =
        reviews.length > 0
            ? reviews.reduce((acc, review) => acc + review.rating, 0) /
              reviews.length
            : 0;
    const ratingCounts = [5, 4, 3, 2, 1].map(
        (rating) =>
            reviews.filter((review) => Math.floor(review.rating) === rating)
                .length
    );

    return (
        <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            <div className="mb-8">
                <CardContent className="p-6">
                    <div>
                        <div className="flex items-center mb-4">
                            <span className="text-5xl font-bold mr-4">
                                {averageRating.toFixed(1)}
                            </span>
                            <div>
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`h-5 w-5 ${
                                                star <=
                                                Math.round(averageRating)
                                                    ? "text-yellow-400 fill-yellow-400"
                                                    : "text-muted fill-muted"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Based on {reviews.length} reviews
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            {[5, 4, 3, 2, 1].map((rating, index) => {
                                const count = ratingCounts[index];
                                const percentage =
                                    reviews.length > 0
                                        ? (count / reviews.length) * 100
                                        : 0;

                                return (
                                    <div
                                        key={rating}
                                        className="flex items-center"
                                    >
                                        <div className="w-12 text-sm text-muted-foreground">
                                            {rating} stars
                                        </div>
                                        <div className="flex-1 mx-3">
                                            <Progress
                                                value={percentage}
                                                className="h-2"
                                            />
                                        </div>
                                        <div className="w-8 text-sm text-muted-foreground text-right">
                                            {count}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">
                        Loading reviews...
                    </span>
                </div>
            ) : reviews.length === 0 ? (
                <div>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                            No reviews yet. Be the first to review this product!
                        </p>
                    </CardContent>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review.id}>
                            <CardHeader className="pb-3">
                                <div className="flex items-start">
                                    <Avatar className="h-10 w-10 mr-3">
                                        <AvatarImage
                                            src={
                                                review.user.image ||
                                                "/placeholder.svg"
                                            }
                                            alt={review.user.name}
                                        />
                                        <AvatarFallback>
                                            {review.user.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-base font-medium">
                                            {review.user.name}
                                        </CardTitle>
                                        <div className="flex items-center mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < review.rating
                                                            ? "text-yellow-400 fill-yellow-400"
                                                            : "text-muted fill-muted"
                                                    }`}
                                                />
                                            ))}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {
                                                    review?.createdAt?.split(
                                                        "T"
                                                    )[0]
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-foreground">
                                    {review.comment}
                                </p>
                            </CardContent>
                            <Separator></Separator>
                        </div>
                    ))}
                </div>
            )}
            <div className="flex flex-col justify-start p-6">
                <h3 className="text-lg w-full text-left font-medium mb-2">
                    Share your thoughts
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                    If you've used this product, share your thoughts with other
                    customers
                </p>
                <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                    <DialogTrigger asChild>
                        <Button>Write a review</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Write a review</DialogTitle>
                            <CardDescription>
                                Share your experience with this product
                            </CardDescription>
                        </DialogHeader>

                        <div>
                            <CardContent>
                                {!user && (
                                    <Alert className="mb-6" variant="warning">
                                        <AlertTitle>Login Required</AlertTitle>
                                        <AlertDescription>
                                            Please{" "}
                                            <a
                                                href="/login"
                                                className="font-medium underline"
                                            >
                                                log in
                                            </a>{" "}
                                            to submit a review.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium mb-2">
                                            Rating
                                        </label>
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((rating) => (
                                                <button
                                                    key={rating}
                                                    type="button"
                                                    onClick={() =>
                                                        handleRatingChange(
                                                            rating
                                                        )
                                                    }
                                                    className="p-1 focus:outline-none"
                                                >
                                                    <Star
                                                        className={`h-6 w-6 ${
                                                            rating <=
                                                            userReview.rating
                                                                ? "text-yellow-400 fill-yellow-400"
                                                                : "text-muted"
                                                        }`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label
                                            htmlFor="comment"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Your Review
                                        </label>
                                        <Textarea
                                            id="comment"
                                            placeholder="Share your experience with this product..."
                                            value={userReview.comment}
                                            onChange={handleCommentChange}
                                            rows={4}
                                            disabled={!user || submitting}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={!user || submitting}
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            "Submit Review"
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default ReviewSection;
