import { useNavigate } from "react-router";
const useGoBack = () => {
  const navigate = useNavigate();
  const goBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
  return goBack;
};
var stdin_default = useGoBack;
export {
  stdin_default as default
};
