// @flow

interface Source {
    getContent(): Promise<{
        name: string,
        data: *
    }>,
    getName(): string,
}

interface Storage {
    saveNewContent(content: *, contentName: string, sourceName: string): Promise<void>
}

export function findAndStoreContent(source: Source, storage: Storage): Promise<void> {
    return source.getContent()
        .then( content => {
            return storage.saveNewContent(
                content.name,
                content.data,
                source.getName(),
            )    
        })
}
