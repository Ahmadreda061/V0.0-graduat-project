const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validExtensions = [".png", ".jpg", ".jpeg"];

    const isValidExtension = validExtensions.some((ext) =>
        file.name.toLowerCase().endsWith(ext)
    );
    return { file, isValidExtension}
}
export default handleFileChange