const handleSubmit = async (e) => {
  e.preventDefault();

  // Simple email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Please enter a valid email address.");
    return;
  }

  // Removed password length check

  try {
    const response = await fetch("https://cadan.xyz/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }), // Updated payload
    });

    const data = await response.json();

    if (response.ok) {
      const { token, role } = data;

      if (!token || !role) {
        setError("Invalid response from server.");
        return;
      }

      login(email, token, role); // Pass email, token, and role
      setError("");
      navigate("/dashboard"); // Redirect to dashboard
    } else {
      setError(data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    setError("Error logging in. Please try again later.");
    console.error("Login Error:", error);
  }
};
