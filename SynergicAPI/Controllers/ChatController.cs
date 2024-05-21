using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SynergicAPI.Models;
using SynergicAPI.Models.Responses;
using System.Data.SqlClient;

namespace SynergicAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly IConfiguration configuration;

        public ChatController(IConfiguration _configuration)
        {
            configuration = _configuration;
        }

        [HttpPost]
        [Route("CreateRoom")]
        public DefaultResponse CreateRoom(string userToken, string otherUsername, string roomName)
        {
            DefaultResponse response = new DefaultResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                if (!Utils.IsLegitUserToken(con, userToken))
                {
                    response.statusMessage = "the given userToken is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    return response;
                }
                if (!Utils.UsernameUsed(con, otherUsername))
                {
                    response.statusMessage = "the given other Username is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Username_Not_Used;
                    return response;
                }

                string uniqueRoomName = $"{roomName}_{Guid.NewGuid()}";
                string filePath = Path.Combine(Environment.CurrentDirectory, "ChatLogs", uniqueRoomName + ".clog");//this makes sure that the room name is unique
                System.IO.File.Create(filePath).Close();


                string query = $"INSERT INTO {Utils.ChatRoomsString} VALUES(@RoomName)";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RoomName", uniqueRoomName);
                    cmd.ExecuteNonQuery();
                }

                int roomID = -1;
                query = $"SELECT ID FROM ChatRooms WHERE RoomName=@RoomName";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RoomName", uniqueRoomName);
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            roomID = (int)reader["ID"];
                        }
                        else
                        {
                            response.statusMessage = "This shouldn't happen in no possible way";
                            response.statusCode = (int)Utils.StatusCodings.Unknown_Error;
                            return response;
                        }
                    }
                }

                query = $"INSERT INTO {Utils.ChatRoomUsersString} VALUES(@RoomID1, (SELECT ID FROM UserAccount WHERE UserToken = @UserToken))," +
                    $"(@RoomID2, (SELECT ID FROM UserAccount WHERE Username = @Username))";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RoomID1", roomID);
                    cmd.Parameters.AddWithValue("@RoomID2", roomID);

                    cmd.Parameters.AddWithValue("@UserToken", userToken);
                    cmd.Parameters.AddWithValue("@Username", otherUsername);

                    cmd.ExecuteNonQuery();
                }
            }

            return response;
        }


        [HttpGet]
        [Route("GetRoomsAsync")]
        public async Task<AvilableRoomsResponse> GetRooms(string userToken)
        {
            AvilableRoomsResponse response = new AvilableRoomsResponse();

            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();

                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusMessage = "the given userToken is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    return response;
                }

                string query = "SELECT RoomID FROM ChatRoomUsers WHERE UserID = @UserID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@UserID", userID);
                    using(SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        if(!reader.HasRows) return response;

                        response.rooms = new List<RoomData>();

                        while (reader.Read())
                        {
                            RoomData room = new RoomData()
                            {
                                RoomID = (int)reader["RoomID"]
                            };
                            response.rooms.Add(room);
                        }
                    }
                }

                for (int i = 0; i < response.rooms.Count; i++)
                {
                    query = "SELECT RoomName FROM ChatRooms WHERE ID = @ID";
                    using (SqlCommand cmd = new SqlCommand(query, con))
                    {
                        int id = response.rooms[i].RoomID;
                        cmd.Parameters.AddWithValue("@ID", id);

                        string name = (string)cmd.ExecuteScalar();
                        name = name.Split("_")[0];

                        response.rooms[i] = new RoomData(){
                            RoomName = name,
                            RoomID = id
                        };
                    }
                }
            }

            return response;
        }

        
        [HttpPost]
        [Route("SendMessageAsync")]
        public async Task<DefaultResponse> SendMessageAsync(string userToken, int chatID, string message)
         {
            DefaultResponse response = new DefaultResponse();
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusMessage = "the given userToken is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    return response;
                }

                string query = "SELECT * FROM ChatRoomUsers WHERE RoomID = @RoomID AND UserID = @UserID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RoomID", chatID);
                    cmd.Parameters.AddWithValue("@UserID", userID);
                    if((int)cmd.ExecuteScalar() == 0)
                    {
                        response.statusMessage = "room not found or user is not a part of this room";
                        response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                        return response;
                    }
                }
                string roomName = "";

                query = "SELECT RoomName FROM ChatRooms WHERE ID = @ID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ID", chatID);
                    roomName = (string)cmd.ExecuteScalar();
                }

                string username = Utils.UserIDToUsername(con, userID);

                string filePath = Path.Combine(Environment.CurrentDirectory, "ChatLogs", roomName + ".clog");

                await System.IO.File.AppendAllTextAsync(filePath, $"{DateTime.Now}*lineSplitter_SynergicRoom:{chatID}*{username}*lineSplitter_SynergicRoom:{chatID}*{message}*lineEnd_SynergicRoom:{chatID}*\n");
            }
            return response;
        }

        /// <summary>
        /// Gets the "Unread" messages in the chat
        /// </summary>
        /// <param name="userToken"></param>
        /// <param name="chatID"></param>
        /// <param name="aquiredMessages">the array of the messages ids that the user already has, it's required to make sure not to send data that the user already have -to save performance and bandwidth- يعني علشان ما تخلص الحزمة بخمس ثواني </param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetMessagesAsync")]
        public async Task<RoomMessagesResponse> GetMessagesAsync(string userToken, int chatID, int[] aquiredMessages)
        {
            RoomMessagesResponse response = new RoomMessagesResponse();
            using (SqlConnection con = new SqlConnection(configuration.GetConnectionString("SynergicCon"))) //Create connection with the database.
            {
                con.Open();
                if (!Utils.IsLegitUserTokenWithID(con, userToken, out int userID))
                {
                    response.statusMessage = "the given userToken is wrong";
                    response.statusCode = (int)Utils.StatusCodings.Account_Not_Found;
                    return response;
                }

                string query = "SELECT * FROM ChatRoomUsers WHERE RoomID = @RoomID AND UserID = @UserID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@RoomID", chatID);
                    cmd.Parameters.AddWithValue("@UserID", userID);
                    if ((int)cmd.ExecuteScalar() == 0)
                    {
                        response.statusMessage = "room not found or user is not a part of this room";
                        response.statusCode = (int)Utils.StatusCodings.Illegal_Data;
                        return response;
                    }
                }

                string roomName = "";
                query = "SELECT RoomName FROM ChatRooms WHERE ID = @ID";
                using (SqlCommand cmd = new SqlCommand(query, con))
                {
                    cmd.Parameters.AddWithValue("@ID", chatID);
                    roomName = (string)cmd.ExecuteScalar();
                }

                string filePath = Path.Combine(Environment.CurrentDirectory, "ChatLogs", roomName + ".clog");

                string content = await System.IO.File.ReadAllTextAsync(filePath);

                string[] lines = content.Split($"*lineEnd_SynergicRoom:{chatID}*");
                if(lines.Length == aquiredMessages.Length)
                {
                    response.statusMessage = "User is already up to date";
                    return response;
                }
                for (int i = 0; i < lines.Length; i++)
                {
                    if (aquiredMessages.Contains(i)) continue;

                    string[] lineFrags = lines[i].Split($"*lineSplitter_SynergicRoom:{chatID}*");
                    if(lineFrags.Length != 3) continue;
                    RoomMessageData roomMessageData = new RoomMessageData()
                    {
                        SenderName = lineFrags[1],
                        SendTime = DateTime.Parse(lineFrags[0]),
                        Message = lineFrags[2],
                    };
                    response.messages.Add(roomMessageData);
                }
            }
            return response;
        }
    }
}
