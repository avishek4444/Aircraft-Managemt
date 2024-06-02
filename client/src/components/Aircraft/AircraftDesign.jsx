import { Tooltip } from "@mantine/core";
import { useBooking } from "context/BookingContext";

const AircraftDesign = ({ seatClassData }) => {
  const { selectedSeat, setSelectedSeat } = useBooking();

  const aircraftData = seatClassData?.seats;

  // Determine the number of columns on each side based on the class type
  const numColumns = seatClassData?.name === "First Class" ? 2 : 3;

  // Split the data into two equal groups
  const halfLength = Math.ceil(aircraftData?.length / 2);
  const leftColumn = aircraftData?.slice(0, halfLength);
  const rightColumn = aircraftData?.slice(halfLength);

  // Function to create rows based on the number of columns
  const createRows = (columnData) => {
    const rows = [];
    for (let i = 0; i < columnData?.length; i += numColumns) {
      rows.push(columnData.slice(i, i + numColumns));
    }
    return rows;
  };

  const leftRows = createRows(leftColumn);
  const rightRows = createRows(rightColumn);

  // Determine the starting row number based on the class name
  const getStartingRowNumber = () => {
    if (seatClassData?.name === "First Class") {
      return 1;
    } else if (seatClassData?.name === "Business Class") {
      return leftRows.length; // assuming after First Class ends at 4
    } else if (seatClassData?.name === "Economy Class") {
      return 8; // Assuming Business Class ends at 8
    }
    return 1;
  };

  const startingRowNumber = getStartingRowNumber();

  const seatColor =
    (seatClassData?.name === "First Class" && "red") ||
    (seatClassData?.name === "Business Class" && "blue") ||
    (seatClassData?.name === "Economy Class" && "green");

  const seatClassName = `p-2 text-white w-[44px] h-[50px] bg-[${seatColor}] hover:bg-[#4287f5] cursor-pointer`;

  const selectAndUnselectSeats = (seatId, seatName) => {
    const selectedSeatIndex = selectedSeat.findIndex((c) => c?._id === seatId);
    if (selectedSeatIndex !== -1) {
      // Deselect the seat if it's already selected
      setSelectedSeat((prevState) =>
        prevState.filter((seat) => seat?._id !== seatId)
      );
    } else {
      // Check if the user has already selected 6 seats
      if (selectedSeat.length >= 6) {
        alert("You can select a maximum of 6 seats.");
        return;
      }

      // Select the seat if it's not already selected
      const newSelectedSeat = aircraftData.find((c) => c?._id === seatId);
      newSelectedSeat.seatName = seatName;
      newSelectedSeat.seatClass = seatClassData?.name;
      setSelectedSeat((prevState) => [...prevState, newSelectedSeat]);
    }
  };

  const getSeatName = (rowIndex, colIndex) => {
    const columnLetter = String.fromCharCode(65 + colIndex);
    return `${startingRowNumber + rowIndex}${columnLetter}`;
  };

  return (
    <div className="px-10">
      <div className={`flex flex-1 gap-10 justify-center`}>
        <div className="flex-1 flex flex-col items-center">
          {leftRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-4">
              {row?.map((item, colIndex) => {
                const isSelected = selectedSeat?.some(
                  (seat) => seat?._id === item?._id
                );
                const isBooked = item.seatStatus === "booked";
                const isAvailable = item.seatStatus === "available";
                const isLocked = item.locked === true;
                const seatName = getSeatName(rowIndex, colIndex);

                return (
                  <Tooltip.Floating
                    key={colIndex}
                    multiline
                    label={`Seat: ${seatName} | Status: ${
                      item.locked ? "locked" : item.seatStatus
                    } | Price: $${item.seatPrice}`}
                  >
                    <div
                      key={colIndex}
                      className="m-2 hover:!bg-[#8db6f7]"
                      onClick={() =>
                        selectAndUnselectSeats(item?._id, seatName)
                      }
                    >
                      <button
                        style={{
                          backgroundColor: isLocked
                            ? "pink"
                            : isSelected
                            ? "#8db6f7"
                            : isBooked
                            ? "black"
                            : seatColor,
                          opacity: (isBooked || isLocked) && "0.5",
                          cursor:
                            isBooked || isLocked ? "not-allowed" : "pointer",
                        }}
                        disabled={isBooked || isLocked}
                        className={`${seatClassName} hover:bg-[#8db6f7] text-white`}
                      >
                        {seatName}
                      </button>
                    </div>
                  </Tooltip.Floating>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex-1 flex flex-col items-center">
          {rightRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex mb-4">
              {row.map((item, colIndex) => {
                const isSelected = selectedSeat.some(
                  (seat) => seat?._id === item?._id
                );
                const isBooked = item.seatStatus === "booked";
                const isAvailable = item.seatStatus === "available";
                const isLocked = item.locked === true;
                const seatName = getSeatName(rowIndex, colIndex + numColumns);

                return (
                  <Tooltip.Floating
                    key={colIndex}
                    label={`Seat: ${seatName} | Status: ${
                      item.locked ? "locked" : item.seatStatus
                    } | Price: $${item.seatPrice}`}
                  >
                    <div
                      key={colIndex}
                      className="m-2"
                      onClick={() =>
                        selectAndUnselectSeats(item?._id, seatName)
                      }
                    >
                      <button
                        style={{
                          backgroundColor: isLocked
                          ? "pink"
                          : isSelected
                          ? "#8db6f7"
                          : isBooked
                          ? "black"
                          : seatColor,
                          opacity: (isBooked || isLocked) && "0.5",
                          cursor:
                            isBooked || isLocked ? "not-allowed" : "pointer",
                        }}
                        disabled={isBooked || isLocked}
                        className={`${seatClassName} text-white`}
                      >
                        {seatName}
                      </button>
                    </div>
                  </Tooltip.Floating>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AircraftDesign;
