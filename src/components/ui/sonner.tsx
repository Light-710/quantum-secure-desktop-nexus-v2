
import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          error:
            "group-[.toaster]:bg-[#A84332] group-[.toaster]:text-white group-[.toaster]:border-[#A84332]/80",
          success:
            "group-[.toaster]:bg-[#6B8E23] group-[.toaster]:text-white group-[.toaster]:border-[#6B8E23]/80",
          warning:
            "group-[.toaster]:bg-[#E5A17D] group-[.toaster]:text-[#3E3D3A] group-[.toaster]:border-[#E5A17D]/80",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
