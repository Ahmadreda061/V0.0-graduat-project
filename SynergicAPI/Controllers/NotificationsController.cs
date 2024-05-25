using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SynergicAPI.Models.Notifications;
using SynergicAPI.Models.Notifications.NotificationTypes;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;
using System.Diagnostics;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public NotificationsController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpGet]
        [Route("GetNotifications")]
        public NotificationsResponse GetNotifications(string userToken)
        {
            NotificationsResponse response = new NotificationsResponse();
            
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Account couldn't be found!";
                    return response;
                }
                response.Notifications = new List<SynergicNotification>();
                string query = $"SELECT * FROM Notifications WHERE RecieverID = @RecieverID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RecieverID", userID);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SynergicNotification notification = new SynergicNotification();
                            notification.NotificationID = (int)reader["ID"];
                            notification.NotificationCategory = (int)reader["NotificationCategory"];
                            notification.IsRead = (bool)reader["IsRead"];

                            switch ((int)reader["NotificationCategory"])
                            {
                                case (int)Utils.NotificationCategory.System:
                                    notification.senderName = "System";

                                    break;
                                case (int)Utils.NotificationCategory.ServiceRequest:
                                    notification.senderName = ((int)reader["SenderID"]).ToString();
                                    notification.content = JsonConvert.DeserializeObject<ServiceRequestNotification>((string)reader["Content"]);
                                    break;


                                case (int)Utils.NotificationCategory.Message:
                                    break;


                                case (int)Utils.NotificationCategory.Review:
                                    notification.senderName = ((int)reader["SenderID"]).ToString();
                                    notification.content = JsonConvert.DeserializeObject<ReviewNotification>((string)reader["Content"]);
                                    break;//TODO: RETURN WRITER PP WITH THE NOTIFICATION


                                default:
                                    break;
                            }
                            response.Notifications.Add(notification);
                        }
                    }
                }
                for (int i = 0; i < response.Notifications.Count; i++)
                {
                    if (int.TryParse(response.Notifications[i].senderName, out int sID) && Utils.UserIDToUsername(con, sID, out string name))
                    {
                        response.Notifications[i].senderName = name;
                    }

                    if (response.Notifications[i].content.GetType() == typeof(ReviewNotification))
                    {
                        ((ReviewNotification)response.Notifications[i].content).senderPP = Utils.UserIDToProfilePicture(con, sID);
                    }
                    else if (response.Notifications[i].content.GetType() == typeof(ServiceRequestNotification))
                    {
                        ((ServiceRequestNotification)response.Notifications[i].content).senderPP = Utils.UserIDToProfilePicture(con, sID);
                    }
                }
            }

            return response; // Serialize and deserialize to apply settings
        }


        [HttpGet]
        [Route("MarkNotificationAsRead")]
        public DefaultResponse MarkNotificationAsRead(string userToken, int notificationID)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                if(!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    response.statusMessage = "Account couldn't be found!";
                    return response;
                }


                string query = "UPDATE Notifications SET IsRead = @IsRead WHERE ID = @ID AND RecieverID = @RecieverID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@IsRead", true);
                    cmd.Parameters.AddWithValue("@ID", notificationID);
                    cmd.Parameters.AddWithValue("@RecieverID", userID);
                    if(cmd.ExecuteNonQuery() == 0)
                    {
                        response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                        response.statusMessage = "NotificationID didn't match with the UserToken";
                        return response;
                    }
                }
            }
            return response;
        }
    }
}
