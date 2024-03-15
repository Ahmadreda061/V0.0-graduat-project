import { useReducer } from "react";

function Signup() {
  const initValues = {
    fname: "",
    lname: "",
    userName: "",
    email: "",
    password: "",
    passwordRepat: "",
    phone: "",
    gender: "",
    bDate: "",
  };

  const reducer = (values, action) => {
    switch (action.type) {
      case "INPUT":
        return {
          ...values,
          [action.field]: action.value,
        };
      case "SELECT":
        return {
          ...values,
          [action.field]: action.value,
        };
    }
  };

  const [values, dispatch] = useReducer(reducer, initValues);

  function change(e) {
    const element = e.target;
    dispatch({
      type: element.tagName,
      field: element.name,
      value: element.value,
    });
  }
  function submit(e) {
    e.preventDefault();
    console.log(values);
  }
  return (
    <form className="signup" onSubmit={submit}>
      <div className="input-togthor ">
        <div>
          <label htmlFor="fname">First name</label>
          <input
            type="text"
            id="fname"
            name="fname"
            value={values.fname}
            onChange={change}
          />
        </div>
        <div>
          <label htmlFor="lname">Last name</label>
          <input
            type="text"
            id="lname"
            name="lname"
            value={values.lname}
            onChange={change}
          />
        </div>
      </div>

      <label htmlFor="userName">User Name</label>
      <input
        type="userName"
        id="userName"
        name="userName"
        value={values.userName}
        onChange={change}
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        value={values.email}
        onChange={change}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        value={values.password}
        onChange={change}
      />

      <label htmlFor="passwordRepat">Repeat Password</label>
      <input
        type="password"
        id="passwordRepat"
        name="passwordRepat"
        value={values.passwordRepat}
        onChange={change}
      />

      <label htmlFor="phone">Phone Number</label>
      <input
        type="tel"
        id="phone"
        name="phone"
        value={values.phone}
        onChange={change}
      />

      <div className="input-togthor ">
        <div>
          <label htmlFor="gender">Gender</label>
          <select
            name="gender"
            id="gender"
            onChange={change}
            value={values.bDate}
          >
            <option value="1">Male</option>
            <option value="0">Female</option>
          </select>
        </div>
        <div>
          <label htmlFor="bDate">Birth Date</label>
          <input
            type="date"
            name="bDate"
            id="bDate"
            value={values.bDate}
            onChange={change}
          />
        </div>
      </div>
      <button className="btn">Sign Up</button>
    </form>
  );
}

export default Signup;
