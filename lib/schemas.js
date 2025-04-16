import { z } from "zod"

const fileSizeLimit = 5 * 1024 * 1024

export const DOCUMENT_SCHEMA = z
  .instanceof(File)
  .refine(
    (file) =>
      [
        "application/pdf",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(file.type),
    { message: "Invalid document file type" }
  )
  .refine((file) => file.size <= fileSizeLimit, {
    message: "File size should not exceed 5MB",
  })

export const IMAGE_SCHEMA = z.object({
	filepath: z.string(), // eller 'path' afhængigt af version
	mimetype: z.string().refine(type =>
		["image/png", "image/jpeg", "image/jpg", "image/svg+xml", "image/gif"].includes(type),
		{ message: "Invalid image file type" }
	),
	size: z.number().max(fileSizeLimit, {
		message: "File size should not exceed 5MB",
	}),
	newFilename: z.string().min(1),
	originalFilename: z.string().min(1),
})
