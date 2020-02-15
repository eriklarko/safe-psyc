// @flow

// Represents an image that shouldn't need a loading indicator. It's mostly to
// get a nicer type than just `number`. they can be safely created using
// `require('./path/to/image.png');
export type PreloadedImage = number;

// Represents an image that will likely need a loading indicator.
// The reason for the strange `typeof exampleImage` is because the official flow
// type cannot be imported and includes many properties that I don't want to
// redefine here.
const exampleImage = { uri: './path/to/some/image.png' };
export type ImageThatNeedsToBeLoaded = typeof exampleImage;