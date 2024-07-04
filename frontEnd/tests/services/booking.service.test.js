import axios from "axios";
import {
  addBooking,
  getBookingsByUserId,
  getAllBookings,
  cancelBooking,
  getBookingById,
  updateBooking,
  getUserById,
} from "../../src/services/booking.service";
import testBookings from "../testBookings.js";

const API_URL = "https://bestrestaurant-challenge-6-be.onrender.com/booking";

vi.mock("axios");

describe("Booking Service Tests", () => {
  describe("addBooking tests", () => {
    const mockBookingData = {
      _id: {
        $oid: "6678c17eb5af6099dea699b9",
      },
      userId: "66787cc8ca110581093c2f33",
      date: {
        $date: "2024-06-28T00:00:00.000Z",
      },
      time: "23:43",
      numberOfPeople: 8,
      __v: 0,
    };

    it("should make the correct external data call", async () => {
      // Arrange
      const userId = "66787cc8ca110581093c2f33";
      const date = "2024-06-28T00:00:00.000Z";
      const time = "23:43";
      const numberOfPeople = 8;

      axios.post.mockResolvedValueOnce({ data: mockBookingData });

      // Act
      await addBooking(userId, date, time, numberOfPeople);

      // Assert
      expect(axios.post).toHaveBeenCalledWith(`${API_URL}/add`, {
        userId,
        date,
        time,
        numberOfPeople,
      });
    });

    it("should return the correct data when calling axios.post", async () => {
      // Arrange
      axios.post.mockResolvedValueOnce({ data: mockBookingData });

      // Act
      const result = await addBooking(
        "66787cc8ca110581093c2f33",
        "2024-06-28T00:00:00.000Z",
        "23:43",
        8
      );

      // Assert
      expect(result).toEqual(mockBookingData);
    });

    it("should handle errors correctly", async () => {
      // Arrange
      const error = { response: { data: { message: "Error" } } };
      axios.post.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(
        addBooking(
          "66787cc8ca110581093c2f33",
          "2024-06-28T00:00:00.000Z",
          "23:43",
          8
        )
      ).rejects.toThrow("Error");
    });

    it("should return a generic error message if no error response", async () => {
      // Arrange
      const error = new Error("Network Error");
      axios.post.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(
        addBooking(
          "66787cc8ca110581093c2f33",
          "2024-06-28T00:00:00.000Z",
          "23:43",
          8
        )
      ).rejects.toThrow("An error occurred while adding the booking");
    });
  });

  describe("getBookingsByUserId tests", () => {
    const userId = "66787cc8ca110581093c2f33";

    it("should return mock bookings data", async () => {
      // Arrange
      axios.get.mockResolvedValueOnce({ data: testBookings });

      // Act
      const result = await getBookingsByUserId(userId);

      // Assert
      expect(result).toEqual(testBookings);
    });

    it("should make the correct external data call", async () => {
      // Arrange
      axios.get.mockResolvedValueOnce({ data: testBookings });

      // Act
      const result = await getBookingsByUserId(userId);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/getAllById/${userId}`);
      expect(result).toEqual(testBookings);
    });

    it("should return the correct data when calling axios.get", async () => {
      // Arrange
      axios.get.mockResolvedValueOnce({ data: testBookings });

      // Act
      const result = await getBookingsByUserId(userId);

      // Assert
      expect(result).toEqual(testBookings);
    });

    it("should throw an error if the request fails", async () => {
      // Arrange
      const error = {
        response: { data: { message: "Error fetching bookings" } },
      };
      axios.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getBookingsByUserId(userId)).rejects.toThrow(
        "Error fetching bookings"
      );
    });

    it("should throw a generic error if the error message is not provided", async () => {
      // Arrange
      axios.get.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(getBookingsByUserId(userId)).rejects.toThrow(
        "An error occurred while fetching the bookings"
      );
    });
  });

  describe("getAllBookings tests", () => {
    const mockFilterDate = "2024-06-28";

    it("should return all bookings without filter date", async () => {
      // Arrange
      const mockResponse = { data: testBookings };
      axios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await getAllBookings();

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/getAll`);
      expect(result).toEqual(testBookings);
    });

    it("should return filtered bookings with filter date", async () => {
      // Arrange
      const mockResponse = { data: testBookings };
      const urlWithFilter = `${API_URL}/getAll?date=${mockFilterDate}`;
      axios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await getAllBookings(mockFilterDate);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(urlWithFilter);
      expect(result).toEqual(testBookings);
    });

    it("should throw an error if the request fails", async () => {
      // Arrange
      const error = {
        response: { data: { message: "Error fetching bookings" } },
      };
      axios.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getAllBookings()).rejects.toThrow("Error fetching bookings");
    });

    it("should throw a generic error if the error message is not provided", async () => {
      // Arrange
      axios.get.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(getAllBookings()).rejects.toThrow(
        "An error occurred while fetching the bookings"
      );
    });
  });

  describe("cancelBooking tests", () => {
    const bookingId = "6678c17eb5af6099dea699b9";

    it("should cancel booking successfully", async () => {
      // Arrange
      const mockResponse = {
        data: { message: "Booking cancelled successfully" },
      };
      axios.delete.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await cancelBooking(bookingId);

      // Assert
      expect(axios.delete).toHaveBeenCalledWith(
        `${API_URL}/delete/${bookingId}`
      );
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if the cancellation fails", async () => {
      // Arrange
      const error = {
        response: { data: { message: "Failed to cancel booking" } },
      };
      axios.delete.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(cancelBooking(bookingId)).rejects.toThrow(
        "Failed to cancel booking"
      );
    });

    it("should throw a generic error if the error message is not provided", async () => {
      // Arrange
      axios.delete.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(cancelBooking(bookingId)).rejects.toThrow(
        "An error occurred while cancelling the booking"
      );
    });
  });

  describe("getBookingById tests", () => {
    const bookingId = "6678c17eb5af6099dea699b9";

    it("should return booking by ID successfully", async () => {
      // Arrange
      const mockResponse = { data: testBookings };
      axios.get.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await getBookingById(bookingId);

      // Assert
      expect(axios.get).toHaveBeenCalledWith(`${API_URL}/${bookingId}`);
      expect(result).toEqual(testBookings);
    });

    it("should throw an error if the booking retrieval fails", async () => {
      // Arrange
      const error = {
        response: { data: { message: "Failed to fetch booking" } },
      };
      axios.get.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(getBookingById(bookingId)).rejects.toThrow(
        "Failed to fetch booking"
      );
    });

    it("should throw a generic error if the error message is not provided", async () => {
      // Arrange
      axios.get.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(getBookingById(bookingId)).rejects.toThrow(
        "An error occurred while fetching the booking"
      );
    });
  });

  describe("updateBooking tests", () => {
    const bookingId = "6678c17eb5af6099dea699b9";
    const updatedDate = "2024-06-29T00:00:00.000Z";
    const updatedTime = "18:00";
    const updatedNumberOfPeople = 5;

    it("should update booking successfully", async () => {
      // Arrange
      const mockResponse = {
        data: { message: "Booking updated successfully" },
      };
      axios.put.mockResolvedValueOnce(mockResponse);

      // Act
      const result = await updateBooking(
        bookingId,
        updatedDate,
        updatedTime,
        updatedNumberOfPeople
      );

      // Assert
      expect(axios.put).toHaveBeenCalledWith(`${API_URL}/edit/${bookingId}`, {
        date: updatedDate,
        time: updatedTime,
        numberOfPeople: updatedNumberOfPeople,
      });
      expect(result).toEqual(mockResponse.data);
    });

    it("should throw an error if the update fails", async () => {
      // Arrange
      const error = {
        response: { data: { message: "Failed to update booking" } },
      };
      axios.put.mockRejectedValueOnce(error);

      // Act & Assert
      await expect(
        updateBooking(
          bookingId,
          updatedDate,
          updatedTime,
          updatedNumberOfPeople
        )
      ).rejects.toThrow("Failed to update booking");
    });

    it("should throw a generic error if the error message is not provided", async () => {
      // Arrange
      axios.put.mockRejectedValueOnce(new Error());

      // Act & Assert
      await expect(
        updateBooking(
          bookingId,
          updatedDate,
          updatedTime,
          updatedNumberOfPeople
        )
      ).rejects.toThrow("An error occurred while updating the booking");
    });
  });

  // describe("getUserById tests", () => {
  //   const userId = "66787cc8ca110581093c2f33";

  //   const mockUser = {
  //     _id: userId,
  //     username: "testuser",
  //     email: "testuser@example.com",
  //     createdAt: "2024-06-29T12:00:00.000Z",
  //   };

  //   it("should return user details by ID successfully", async () => {
  //     // Arrange
  //     const mockResponse = { data: mockUser };
  //     axios.get.mockResolvedValueOnce(mockResponse);

  //     // Act
  //     const result = await getUserById(userId);

  //     // Assert
  //     expect(axios.get).toHaveBeenCalledWith(`${API_URL}/user/${userId}`);
  //     expect(result).toEqual(mockUser);
  //   });

  //   //   it("should throw an error if user details retrieval fails", async () => {
  //   //     // Arrange
  //   //     const error = {
  //   //       response: { data: { message: "Failed to fetch user details" } },
  //   //     };
  //   //     axios.get.mockRejectedValueOnce(error);

  //   //     // Act & Assert
  //   //     await expect(getUserById(userId)).rejects.toThrow(
  //   //       "Failed to fetch user details"
  //   //     );
  //   //   });

  //   //   it("should throw a generic error if the error message is not provided", async () => {
  //   //     // Arrange
  //   //     axios.get.mockRejectedValueOnce(new Error());

  //   //     // Act & Assert
  //   //     await expect(getUserById(userId)).rejects.toThrow(
  //   //       "An error occurred while fetching the user details"
  //   //     );
  //   //   });
  // });
});
