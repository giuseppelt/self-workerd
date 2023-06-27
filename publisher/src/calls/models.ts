import { z } from "zod";


export const WorkerDefinitionSchema = z.object({
    name: z.string().min(4).max(20).regex(/^[a-zA-Z0-9-_]+$/),
    module: z.string().min(20),
    flags: z.array(z.string().min(2).max(30)).optional(),
    compatibilityDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export type WorkerDefinition = z.infer<typeof WorkerDefinitionSchema>;


export type WorkerConfig = {
    routes: string[]
}
