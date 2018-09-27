// @flow

type foo = { key: string, default: string }

const settings: { [*]: foo} = {
    ASK_CURR_EM_Q: {
        key: 'ask-current-emotion-question',
        default: 'true',
    },
};


export const SettingsKeys: { [$Keys<typeof settings>]: string } =
    Object.keys(settings)
        .reduce( (acc, curr) => {
                acc[curr] = settings[curr].key;
                return acc;
        }, {});

export function getDefault(name: string): ?string {
    for (const key of Object.keys(settings)) {
        if (key === name) {
            return settings[key].default;
        }
    }

    return null;
}
