import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingGlow } from "@/components/loading-glow-card"
import { cn } from "@/lib/utils"

interface TableSkeletonProps {
  className?: string
  rows?: number
  columns?: number
  showHeader?: boolean
  title?: string
}

export function TableSkeleton({ 
  className, 
  rows = 5, 
  columns = 4, 
  showHeader = true,
  title
}: TableSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden border-white/10 bg-white/5", className)}>
      {(showHeader || title) && (
         <CardHeader className="pb-4 border-b border-white/10 bg-white/5">
            {title && (
                <CardTitle className="mb-4">
                    <LoadingGlow className="h-6 w-48 bg-white/10" />
                </CardTitle>
            )}
            {showHeader && (
                <div className="flex gap-4">
                    {Array.from({ length: columns }).map((_, i) => (
                        <LoadingGlow 
                           key={i} 
                           className={cn(
                               "h-4 bg-white/5",
                               i === 0 ? "w-1/3" : "w-20 ml-auto"
                           )} 
                        />
                    ))}
                </div>
            )}
         </CardHeader>
      )}

      <CardContent className="pt-0">
         <div className="divide-y divide-white/5">
             {Array.from({ length: rows }).map((_, r) => (
                <div key={r} className="flex gap-4 py-3">
                    {Array.from({ length: columns }).map((__unused, c) => (
                        <div key={c} className={cn(
                            c === 0 ? "w-1/3" : "w-20 ml-auto"
                        )}>
                            <LoadingGlow
                                className={cn(
                                   "bg-white/5",
                                   c === 0 ? "h-5 w-3/4" : "h-5 w-full"
                                )}
                            />
                            {c === 0 && <LoadingGlow className="h-3 w-1/2 bg-white/5 mt-1" />}
                        </div>
                    ))}
                </div>
             ))}
         </div>
      </CardContent>
    </Card>
  )
}
