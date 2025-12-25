import { useState } from "react"
import { IconFlag, IconAlertTriangle } from "@tabler/icons-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"
import { submitDataReport } from "@/lib/server-functions/data-reports"
import { Label } from "@/components/ui/label"

interface ReportButtonProps {
  indexId: string
  year: number
  indexName: string
}

export function ReportButton({ indexId, year, indexName }: ReportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleReport = async () => {
    try {
      setIsSubmitting(true)
      
      // Generate client-side fingerprint
      // Using User Agent + Timezone + Screen Resolution as requested
      const fingerprint = [
        navigator.userAgent,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        `${window.screen.width}x${window.screen.height}`
      ].join("|");

      const result = await submitDataReport({
        data: {
          indexId,
          year,
          reason,
          fingerprint,
        },
      })

      if (result.success) {
        if (result.alreadyReported) {
          toast.info("Report Updated", {
            description: result.message,
          })
        } else {
          toast.success("Report Submitted", {
            description: "Thank you for helping improve our data accuracy.",
          })
        }
        setIsOpen(false)
        setReason("")
      }
    } catch (error) {
        // Handle rate limit error or other errors
        let message = "Failed to submit report"
        try {
            if (error instanceof Error) {
                const parsed = JSON.parse(error.message)
                if (parsed.code === "RATE_LIMIT_EXCEEDED") {
                    message = "Too many reports. Please try again later."
                }
            }
        } catch (e) {
            // ignore JSON parse error
        }
        
      toast.error("Error", {
        description: message,
      })
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger
        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent size-6 text-muted-foreground hover:text-red-500"
        title="Report incorrect data"
      >
        <IconFlag className="size-3" />
        <span className="sr-only">Report incorrect data</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <IconAlertTriangle className="size-5" />
            </div>
            <div className="text-left">
                <AlertDialogTitle>Report Incorrect Data</AlertDialogTitle>
                <AlertDialogDescription>
                    {indexName} ({year})
                </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        
        <div className="space-y-3 py-2 text-sm text-muted-foreground">
          <p>
            Please let us know why this data seems incorrect. We'll verify it against the official source.
          </p>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Textarea
              id="reason"
              placeholder="e.g., The official report shows a different score..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="resize-none min-h-[80px]"
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault() // prevent auto-close
              handleReport()
            }}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-900 dark:hover:bg-red-800"
          >
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
