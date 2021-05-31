const alogo = "data:image/png;base64,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";



export const afreecatv = {
    logo :  alogo 
}