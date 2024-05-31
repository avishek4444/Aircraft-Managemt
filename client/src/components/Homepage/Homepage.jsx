import { useState } from "react";
import { Container } from "@mantine/core";

import SearchFlight from "components/SearchFlight/SearchFlight";
import { Outlet } from "react-router-dom";

const Homepage = () => {
  const [flightList, setFlightList] = useState([])

  
  return (
    <Container size="xxl" className="flex gap-10">
      <SearchFlight setFlightList={setFlightList}/>
      <div className="w-[70%] h-[90vh] flex-1">
        <Outlet context={[flightList]}/>
      </div>
    </Container>
  );
};

export default Homepage;
