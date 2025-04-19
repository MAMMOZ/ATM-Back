local HttpService = game:GetService("HttpService")

local data = {
    username_bot = "bot_001",
    money_pocket = 100,
    money_hand = 50,
    money_bank = 500,
    status = 1
}

local response = HttpService:PostAsync(
    "http://<your-server-ip>:3000/addbot",
    HttpService:JSONEncode(data),
    Enum.HttpContentType.ApplicationJson
)

print(response)
