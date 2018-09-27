// @flow

export const settings = {
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
