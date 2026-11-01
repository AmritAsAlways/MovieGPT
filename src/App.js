import { Provider } from "react-redux";
import Body from "./components/Body";
import appStore from "./utils/appStore";

// App is the root component. Its only job is to make the Redux store
// available to every component below it.
//
// <Provider store={...}> uses React Context internally: any child, however
// deeply nested, can call useSelector() to READ the store or useDispatch()
// to UPDATE it, without passing props down through every level
// ("prop drilling").
const App = () => {
  return (
    <Provider store={appStore}>
      <Body />
    </Provider>
  );
};

export default App;
