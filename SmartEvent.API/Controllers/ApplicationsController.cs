using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEvent.Data;
using SmartEvent.Data.Entities;

namespace SmartEvent.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ApplicationsController(AppDbContext context)
        {
            _context = context;
        }
        [HttpPost]
        public async Task<IActionResult> Apply([FromBody] EventApplication model)
        {
            try
            {
                var exists = await _context.EventApplication
                    .AnyAsync(a => a.UserId == model.UserId && a.EventId == model.EventId);

                if (exists)
                {
                    return BadRequest("You are already registered for this event.");
                }

                _context.EventApplication.Add(model);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (DbUpdateException ex)
            {
                if (ex.InnerException?.Message.Contains("Duplicate entry") == true)
                {
                    return BadRequest("You are already registered for this event.");
                }

                // For other DB errors
                return StatusCode(500, "An unexpected error occurred.");
            }
        }
        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetApplicationsByUserId(int userId)
        {
            var applications = await _context.EventApplication
                .Include(a => a.Event)
                .Where(a => a.UserId == userId)
                .Select(a => new {
                    a.EventId,
                    a.Event.Title,
                    a.Event.Date
                })
                .ToListAsync();

            return Ok(applications);
        }

    }
}
