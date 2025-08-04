import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Rating,
  Paper,
} from "@mui/material";
import axios from "axios";

// FeedbackForm component for collecting user reviews
const FeedbackForm = () => {
  // State to manage form fields
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: 0,
    comment: "",
  });

  // State to control success message visibility
  const [success, setSuccess] = useState(false);

  // Updates the form when user types into inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Updates the rating value
  const handleRatingChange = (e, value) => {
    setForm({ ...form, rating: value });
  };

  // Form submit logic
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      // POST feedback to backend API
      await axios.post("http://localhost:5000/feedback", form);

      // Show success message and reset form
      setSuccess(true);
      setForm({ name: "", email: "", rating: 0, comment: "" });

      // Optionally hide success after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to submit feedback", err);
    }
  };

  return (
    <Box>
      {/* Section title */}
      <h1 className="text-xl font-semibold mb-4" style={{ marginLeft: "30%" }}>
        Sentiment Overview
      </h1>

      {/* Feedback form wrapper */}
      <Paper
        sx={{
          mx: "auto", // center horizontally
          p: 4,
          mt: 1,
          marginLeft: "10%",
          width: "1000px", // Fixed width
        }}
      >
        <Typography variant="h5" gutterBottom>
          We value your feedback
        </Typography>

        {/* Feedback form */}
        <form onSubmit={handleSubmit}>
          {/* Name field */}
          <TextField
            name="name"
            label="Your Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={handleChange}
            required
          />

          {/* Email field */}
          <TextField
            name="email"
            label="Your Email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Rating component */}
          <Box mt={2}>
            <Typography>Rate your experience:</Typography>
            <Rating
              name="rating"
              value={form.rating}
              onChange={handleRatingChange}
            />
          </Box>

          {/* Comment box */}
          <TextField
            name="comment"
            label="Comments"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={form.comment}
            onChange={handleChange}
          />

          {/* Submit button */}
          <Button
            type="submit"
            variant="contained"
            color="success"
            sx={{ mt: 2, px: 3 }}
          >
            Submit Feedback
          </Button>
        </form>

        {/* Success message */}
        {success && (
          <Typography color="green" mt={2}>
            Thank you for your feedback!
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default FeedbackForm;
