import { Routes, Route } from "react-router-dom";

import Aircraft from "components/Aircraft/Aircraft";
import ChooseFlight from "./components/ChooseFlight/ChooseFlight";

import ClientLayout from "components/ClientLayout";
import Login from "components/Login/Login";
import Homepage from "components/Homepage/Homepage";
import Slider from "components/slider/Slider";

import { QueryClient, QueryClientProvider } from "react-query";
import { Notifications } from "@mantine/notifications";
import Checkout from "components/Checkout/Checkout";
import {BookingProvider} from "./context/BookingContext";
import BookingHistory from "./components/BookingHistory/BookingHistory";



import "@mantine/notifications/styles.css";
import "@mantine/core/styles.css";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Notifications position="bottom-right" zIndex={1000} />
        <BookingProvider>

        
        <Routes>
          <Route path="/" element={<ClientLayout />}>
            <Route path="" element={<Homepage />}>
              <Route path="" element={<Slider />} />
              <Route path="/chooseflight" element={<ChooseFlight />} />
              <Route path="/chooseflight/:id/" element={<Aircraft />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="checkout/:id" element={<Checkout />} />
            <Route path="bookinghistory" element={<BookingHistory />} />
          </Route>
          <Route
            path="*"
            element={
              <>
                <h1 className="text-white">Page Not found!</h1>
              </>
            }
          />
        </Routes>
        </BookingProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
