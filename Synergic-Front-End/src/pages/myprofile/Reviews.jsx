import Review from "./myprofile-component/Review";
import "../../style/myprofile-style/reviews.css";
function Reviews() {
  return (
    <div className="container">
      <div className="myprofile-cards reviews-cards">
        <Review msg="s'kaifdeaw pkfweee eeeeeee eeeeeeeeeee eee eeeeeeee eeeasdf sdfsdfsdf sdfsd e f sdf aswef e fsaf wefs fsd" />
        <Review msg="s'kaifdea wpkfwee eeeee eeeee eeeeee eee sd ajsd lkj sfsdfsdfsd fsdfsd e f sdf aswef e fsaf wefs fsd" />
        <Review msg="Lorem ipsum dolor, sit amet con sectetur adipisicing elit. Tempor a, dolores non. Nam, tempora doloribus. Accusantium quas qui ex. Hic nemo vero accusamus excepturi nesciunt repellat dignissimos sequi accusantium voluptate quia?" />
        <Review msg="Lorem ipsum dolor, sit amet con sectetur adipisicing elit. Tempor a, dolores non. Nam, tempora doloribus. Accusantium quas qui ex. Hic nemo vero accusamus excepturi nesciunt repellat dignissimos sequi accusantium voluptate quia?" />
        <Review msg="Lorem ipsum dolor, sit amet con sectetur adipisicing elit. Tempor a, dolores non. Nam, tempora doloribus. Accusantium quas qui ex. Hic nemo vero accusamus excepturi nesciunt repellat dignissimos sequi accusantium voluptate quia?" />
        <Review msg="Lorem ipsum dolor, sit amet con sectetur adipisicing elit. Tempor a, dolores non. Nam, tempora doloribus. Accusantium quas qui ex. Hic nemo vero accusamus excepturi nesciunt repellat dignissimos sequi accusantium voluptate quia?" />
      </div>
    </div>
  );
}

export default Reviews;
