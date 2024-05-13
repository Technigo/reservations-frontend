import { useEffect, useState } from "react"

import "./App.css"

const formatDate = (dateString) => {
  const options = {
    weekday: "long", // Monday, Tuesday, etc.
    month: "long", // May, June, etc.
    day: "numeric", // 1, 2, 3, etc.
  }

  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", options)
}

const App = () => {
  const [allReservations, setAllReservations] = useState([])
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [date, setDate] = useState("")
  const [partySize, setPartySize] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch("https://reservations-api-tt25.onrender.com/reservations")
      .then((res) => res.json())
      .then((json) => setAllReservations(json))
      .catch((err) => console.error("Fetch error:", err))
  }, [message])

  const handleNewReservation = (event) => {
    event.preventDefault()

    // Validate party size to be within 1-10
    if (parseInt(partySize, 10) < 1 || parseInt(partySize, 10) > 10) {
      setMessage("Party size must be between 1 and 10.")
      return
    }

    if (!name || !phone || !date || !partySize) {
      setMessage("Please fill in all fields.")
      return
    }

    const data = JSON.stringify({
      guestName: name,
      guestPhone: phone,
      date,
      partySize: parseInt(partySize, 10),
    })

    fetch("https://reservations-api-tt25.onrender.com/reservations", {
      method: "POST",
      body: data,
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((json) => {
        setMessage(json.message || "Reservation successful!")
        setName("")
        setPhone("")
        setDate("")
        setPartySize("")
      })
      .catch((err) => {
        console.error("Error submitting reservation:", err)
        setMessage("Error submitting reservation.")
      })
  }

  return (
    <>
      <h1>The restaurant</h1>
      <p>{message}</p>
      <h2>Book a table</h2>
      <form onSubmit={handleNewReservation}>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          value={name}
          placeholder="What's your name?"
          minLength="4"
          required
        />
        <input
          type="text"
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
          placeholder="Phone number?"
          minLength="10"
          required
        />
        <input
          type="number"
          onChange={(e) => setPartySize(e.target.value)}
          value={partySize}
          placeholder="How many?"
          min="1"
          max="10"
          required
        />
        <input
          type="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
          placeholder="What date?"
          required
        />
        <button type="submit">Book now</button>
      </form>
      
      <h2>Reservations</h2>
      <section className="reservations">
        {allReservations.map((reservation) => (
          <div className="reservation-card" key={reservation.id}>
            <h3>{reservation.guestName}</h3>
            <p>Date: {formatDate(reservation.date)}</p>
            <p>Phone: {reservation.guestPhone}</p>
            <p>Party size: {reservation.partySize}</p>
            <p>Confirmed: {reservation.isConfirmed ? "✅" : "❌"}</p>
          </div>
        ))}
      </section>
    </>
  )
}

export default App
