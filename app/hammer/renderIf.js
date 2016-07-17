const isFunc = input => typeof input === 'function';

export default condition => RCTElements =>  condition ? (isFunc(RCTElements) ? RCTElements() : RCTElements) : null;
