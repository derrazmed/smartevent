using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartEvent.Data;
using SmartEvent.Data.Entities;

[Route("api/[controller]")]
[ApiController]
public class EventsController : ControllerBase
{
    private readonly AppDbContext _context;

    public EventsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/events
    [HttpGet]
    public async Task<IActionResult> GetEvents()
    {
        var events = await _context.Events.ToListAsync();
        return Ok(events);
    }

    // POST: api/events
    [HttpPost]
    public async Task<IActionResult> CreateEvent([FromBody] Event ev)
    {
        if (ev == null) return BadRequest("Event is null");

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetEventById), new { id = ev.Id }, ev);
    }

    // GET: api/events/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetEventById(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound();
        return Ok(ev);
    }

    // PUT: api/events/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateEvent(int id, [FromBody] Event ev)
    {
        if (ev == null || id != ev.Id) return BadRequest("Invalid event data");

        var existingEvent = await _context.Events.FindAsync(id);
        if (existingEvent == null) return NotFound();

        existingEvent.Title = ev.Title;
        existingEvent.Description = ev.Description;
        existingEvent.Date = ev.Date;

        await _context.SaveChangesAsync();
        return Ok(existingEvent);
    }

    // DELETE: api/events/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteEvent(int id)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null) return NotFound();

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
