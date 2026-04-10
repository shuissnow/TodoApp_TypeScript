using Microsoft.AspNetCore.Mvc;
using Moq;
using TodoApp.Api.Controllers;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Services;

namespace TodoApp.Api.Tests.Controllers;
// CI動作確認用V3
public class TodosControllerTests
{
    private readonly Mock<ITodoService> _serviceMock = new();
    private readonly TodosController _sut;

    public TodosControllerTests()
    {
        _sut = new TodosController(_serviceMock.Object);
    }

    // --- Create ---

    [Fact]
    public async Task Create_Returns201WithCreatedTodo()
    {
        // Arrange
        CreateTodoRequest request = new CreateTodoRequest { Text = "新しいタスク" };
        Todo createdTodo = new Todo { Id = 1, Text = "新しいタスク", Completed = false, CreatedAt = DateTime.UtcNow };
        _serviceMock.Setup(s => s.CreateAsync(request)).ReturnsAsync(createdTodo);

        // Act
        IActionResult result = await _sut.CreateAsync(request);

        // Assert
        CreatedResult createdResult = Assert.IsType<CreatedResult>(result);
        Assert.Equal(201, createdResult.StatusCode);
        Todo returnedTodo = Assert.IsType<Todo>(createdResult.Value);
        Assert.Equal(createdTodo.Id, returnedTodo.Id);
        Assert.Equal("新しいタスク", returnedTodo.Text);
    }

    // --- Update ---

    [Fact]
    public async Task Update_Returns200WithUpdatedTodo_WhenTodoExists()
    {
        // Arrange
        int id = 1;
        UpdateTodoRequest request = new UpdateTodoRequest { Text = "更新後のタスク", Completed = true };
        Todo updatedTodo = new Todo { Id = id, Text = "更新後のタスク", Completed = true, CreatedAt = DateTime.UtcNow };
        _serviceMock.Setup(s => s.UpdateAsync(id, request)).ReturnsAsync(updatedTodo);

        // Act
        IActionResult result = await _sut.UpdateAsync(id, request);

        // Assert
        OkObjectResult okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        Todo returnedTodo = Assert.IsType<Todo>(okResult.Value);
        Assert.Equal(id, returnedTodo.Id);
        Assert.Equal("更新後のタスク", returnedTodo.Text);
        Assert.True(returnedTodo.Completed);
    }

    [Fact]
    public async Task Update_Returns404_WhenTodoNotFound()
    {
        // Arrange
        int id = 99;
        UpdateTodoRequest request = new UpdateTodoRequest { Text = "更新後のタスク" };
        _serviceMock.Setup(s => s.UpdateAsync(id, request)).ReturnsAsync((Todo?)null);

        // Act
        IActionResult result = await _sut.UpdateAsync(id, request);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    // --- Delete ---

    [Fact]
    public async Task Delete_Returns204_WhenTodoDeleted()
    {
        // Arrange
        int id = 1;
        _serviceMock.Setup(s => s.DeleteAsync(id)).ReturnsAsync(true);

        // Act
        IActionResult result = await _sut.DeleteAsync(id);

        // Assert
        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_Returns404_WhenTodoNotFound()
    {
        // Arrange
        int id = 99;
        _serviceMock.Setup(s => s.DeleteAsync(id)).ReturnsAsync(false);

        // Act
        IActionResult result = await _sut.DeleteAsync(id);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    // --- DeleteCompleted ---

    [Fact]
    public async Task DeleteCompleted_Returns204()
    {
        // Arrange
        _serviceMock.Setup(s => s.DeleteCompletedAsync()).Returns(Task.CompletedTask);

        // Act
        IActionResult result = await _sut.DeleteCompletedAsync();

        // Assert
        Assert.IsType<NoContentResult>(result);
        _serviceMock.Verify(s => s.DeleteCompletedAsync(), Times.Once);
    }

    // --- GetAll ---

    [Fact]
    public async Task GetAll_PassesQueryParamsToService()
    {
        // Arrange
        TodoQueryParams queryParams = new TodoQueryParams { Filter = "overdue", Sort = "due_date" };
        _serviceMock.Setup(s => s.GetAllAsync(queryParams)).ReturnsAsync(new List<Todo>());

        // Act
        await _sut.GetAllAsync(queryParams);

        // Assert
        _serviceMock.Verify(s => s.GetAllAsync(queryParams), Times.Once);
    }

    [Fact]
    public async Task GetAll_Returns200WithEmptyList_WhenNoTodos()
    {
        // Arrange
        TodoQueryParams queryParams = new TodoQueryParams();
        _serviceMock.Setup(s => s.GetAllAsync(queryParams)).ReturnsAsync(new List<Todo>());

        // Act
        IActionResult result = await _sut.GetAllAsync(queryParams);

        // Assert
        OkObjectResult okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        IEnumerable<Todo> returnedTodos = Assert.IsAssignableFrom<IEnumerable<Todo>>(okResult.Value);
        Assert.Empty(returnedTodos);
    }

    [Fact]
    public async Task GetAll_Returns200WithTodos()
    {
        // Arrange
        List<Todo> todos = new List<Todo>
        {
            new() { Id = 1, Text = "タスク1", Completed = false, CreatedAt = DateTime.UtcNow },
            new() { Id = 2, Text = "タスク2", Completed = true, CreatedAt = DateTime.UtcNow },
        };
        TodoQueryParams queryParams = new TodoQueryParams();
        _serviceMock.Setup(s => s.GetAllAsync(queryParams)).ReturnsAsync(todos);

        // Act
        IActionResult result = await _sut.GetAllAsync(queryParams);

        // Assert
        OkObjectResult okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal(200, okResult.StatusCode);
        IEnumerable<Todo> returnedTodos = Assert.IsAssignableFrom<IEnumerable<Todo>>(okResult.Value);
        Assert.Equal(2, returnedTodos.Count());
    }
}
