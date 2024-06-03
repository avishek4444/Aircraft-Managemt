import { Routes, Route } from "react-router-dom";

import Aircraft from "components/client/Aircraft/Aircraft";
import ChooseFlight from "./components/client/ChooseFlight/ChooseFlight";

import ClientLayout from "components/ClientLayout";
import Login from "components/Login/Login";
import Homepage from "components/client/Homepage/Homepage";
import Slider from "components/client/slider/Slider";

import { QueryClient, QueryClientProvider } from "react-query";
import { Notifications } from "@mantine/notifications";
import Checkout from "components/client/Checkout/Checkout";
import {BookingProvider} from "./context/BookingContext";
import BookingHistory from "components/client/BookingHistory/BookingHistory";
import AdminLayout from "components/AdminLayout";
import AdminHomePage from "./components/admin/HomePage/HomePage";
import AircraftListing from "./components/admin/AircraftListing";






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

          <Route path="admin" element={<AdminLayout />}>
            {/* <Route path="" element={<AdminHomePage />} /> */}
            <Route path="" element={<AircraftListing />} />
            {/* <Route path="admin/bookings" element={<Bookings />} /> */}
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
