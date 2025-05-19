using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEvent.Data;
using SmartEvent.Data.Models;
using SmartEvent.Infrastructure.Models;

namespace SmartEvent.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegistrationModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            model.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
            var user = new User
            {
                FullName = model.FullName,
                Email = model.Email,
                Password = model.Password
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User registered successfully." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == login.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                return Unauthorized(new { message = "Invalid email or password." });

            return Ok(new
            {
                message = "Login successful",
                user = new { user.Id, user.FullName, user.Email, user.IsAdmin }
            });
        }
    }
}
