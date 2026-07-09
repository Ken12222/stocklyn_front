const Form = ({ onSubmit, children, className }) => {
  return <form
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit(event);
    }}
    className={` ${className}`}
  >
      {children}
    </form>;
};
var stdin_default = Form;
export {
  stdin_default as default
};
