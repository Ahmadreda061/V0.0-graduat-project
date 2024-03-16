function Login() {
  return (
    <form className="login">
      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email or Username"
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        placeholder="Password "
      />

      <button className="btn">Log In</button>
    </form>
  );
}

export default Login;
