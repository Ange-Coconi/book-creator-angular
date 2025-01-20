export function isFolder(data: any): boolean {
    return (
        typeof data.id === 'number' && 
        typeof data.name === 'string' &&
        typeof data.root === 'boolean' &&
        typeof data.parentFolderId === 'number' &&
        typeof data.userId === 'number' &&
        data.subfolders && data.books
    );
}