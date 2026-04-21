export const htmlToContent=(content)=>{
    return content?.replace(/<[^>]*>/g, "").trim();
}