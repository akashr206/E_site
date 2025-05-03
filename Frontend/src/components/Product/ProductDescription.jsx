
import {Truck, Shield, RotateCcw } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"

const ProductDescription = ({ description }) => {
  return (
    <div className="mt-8">
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        <AccordionItem value="description">
          <AccordionTrigger className="text-lg font-medium">Description</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="shipping">
          <AccordionTrigger className="text-lg font-medium">Shipping & Returns</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              We offer free standard shipping on all orders over ₹499. For orders under ₹499, a flat shipping fee of ₹50 applies.
              All products can be returned within 30 days of delivery for a full refund.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
        <Card>
          <CardContent className="flex items-center p-4">
            <Truck className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <h4 className="text-sm font-medium">Free Shipping</h4>
              <p className="mt-1 text-xs text-muted-foreground">On orders over ₹499</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <Shield className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <h4 className="text-sm font-medium">2 Year Warranty</h4>
              <p className="mt-1 text-xs text-muted-foreground">Full coverage</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center p-4">
            <RotateCcw className="h-8 w-8 text-primary" />
            <div className="ml-4">
              <h4 className="text-sm font-medium">30 Days Return</h4>
              <p className="mt-1 text-xs text-muted-foreground">No questions asked</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default ProductDescription
