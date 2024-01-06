import {
  ReactElement,
  JSXElementConstructor,
  ReactFragment,
  ReactPortal,
} from 'react';

const Container = (props: {
  children:
    | string
    | number
    | boolean
    | ReactElement<unknown, string | JSXElementConstructor<unknown>>
    | ReactFragment
    | ReactPortal
    | null
    | undefined;
}) => {
  return (
    <div className="mt-3">
      <div className="form-container px-10 mx-16 bg-white drop-shadow-lg pt-7 pb-[0.70rem] mt-7 border rounded-md">
        {props.children}
      </div>
    </div>
  );
};

export default Container;
