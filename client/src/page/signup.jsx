// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { RegisterPendings, SignupComponent } from "../components";
// import instance from "../config/instance";
// import { setLoading } from "../redux/loading";
// import "./style.scss";

// const Signup = () => {
//   const { user } = useSelector((state) => state);

//   const [pending, setPending] = useState(false);

//   const { id } = useParams();

//   const dispatch = useDispatch();

//   const location = useLocation();

//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!user) {
//       if (
//         location?.pathname === "/signup" ||
//         location?.pathname === "/signup/"
//       ) {
//         setPending(false);
//         setTimeout(() => {
//           dispatch(setLoading(false));
//         }, 1000);
//       } else {
//         const checkPending = async () => {
//           let res = null;
//           try {
//             res = await instance.get("/api/user/checkPending", {
//               params: {
//                 _id: id,
//               },
//             });
//           } catch (err) {
//             if (err?.response?.status === 404) {
//               navigate("/404");
//             } else {
//               alert(err);
//               navigate("/signup");
//             }
//           } finally {
//             if (res?.data?.status !== 208) {
//               setPending(true);
//               setTimeout(() => {
//                 dispatch(setLoading(false));
//               }, 1000);
//             }
//           }
//         };

//         checkPending();
//       }
//     }
//   }, [location]);

//   return (
//     <div className="Auth">
//       <div className="inner">
//         {pending ? (
//           <RegisterPendings _id={id} />
//         ) : (
//           <>
//             <SignupComponent />

//             <div className="bottum">
//               <div className="start">
//                 <a
//                   href=""
//                   target="_blank"
//                 >
//                   Terms of use
//                 </a>
//               </div>
//               <div className="end">
//                 <a
//                   href=""
//                   target="_blank"
//                 >
//                   Privacy Policy
//                 </a>
//               </div>
//             </div>
//             <p><b>Trajectory Health Limited</b></p>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Signup;
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RegisterPendings, SignupComponent } from "../components";
import instance from "../config/instance";
import { setLoading } from "../redux/loading";
import "./Signup.scss";

const Signup = () => {
  const { user } = useSelector((state) => state);
  const [pending, setPending] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      if (
        location?.pathname === "/signup" ||
        location?.pathname === "/signup/"
      ) {
        setPending(false);
        setTimeout(() => {
          dispatch(setLoading(false));
        }, 1000);
      } else {
        const checkPending = async () => {
          try {
            const res = await instance.get("/api/user/checkPending", {
              params: { _id: id },
            });
            if (res?.data?.status !== 208) {
              setPending(true);
            }
          } catch (err) {
            if (err?.response?.status === 404) {
              navigate("/404");
            } else {
              console.error(err);
              navigate("/signup");
            }
          } finally {
            setTimeout(() => {
              dispatch(setLoading(false));
            }, 1000);
          }
        };
        checkPending();
      }
    }
  }, [location, user, id, dispatch, navigate]);

  return (
    <div className="signup-container">
      <div className="signup-content">
        {pending ? (
          <RegisterPendings _id={id} />
        ) : (
          <>
            <SignupComponent />
            <div className="signup-footer">
              <div className="links">
                <a href="/terms" target="_blank" rel="noopener noreferrer">
                  Terms of use
                </a>
                <a href="/privacy" target="_blank" rel="noopener noreferrer">
                  Privacy Policy
                </a>
              </div>
              <p className="company">Trajectory Health Limited</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Signup;