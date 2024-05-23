using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SynergicAPI.Models.Notifications;
using SynergicAPI.Models.Notifications.NotificationTypes;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;

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
                            notification.NotificationCategory = (int)Utils.NotificationCategory.ServiceRequest;
                            notification.IsRead = (bool)reader["IsRead"];

                            switch ((int)reader["NotificationCategory"])
                            {
                                case (int)Utils.NotificationCategory.System:
                                    notification.content = JsonConvert.DeserializeObject<SystemNotification>((string)reader["Content"]);//API will re-serialize this part, but deserializing is required-esh to show the structure in the API Schemas
                                    break;
                                case (int)Utils.NotificationCategory.ServiceRequest:
                                    notification.content = JsonConvert.DeserializeObject<ServiceRequestNotification>((string)reader["Content"]);//API will re-serialize this part, but deserializing is required-esh to show the structure in the API Schemas
                                    break;
                                case (int)Utils.NotificationCategory.Message:
                                    break;
                                default:
                                    break;
                            }
                            response.Notifications.Add(notification);
                        }
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
