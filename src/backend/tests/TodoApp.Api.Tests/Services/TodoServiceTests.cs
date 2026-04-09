using Moq;
using TodoApp.Api.DTOs;
using TodoApp.Api.Models;
using TodoApp.Api.Repositories;
using TodoApp.Api.Services;


namespace TodoApp.Api.Tests.Services;

public class TodoServiceTests
{
    // CI確認用version5
    private readonly Mock<ITodoRepository> _repositoryMock = new();
    private readonly TodoService _sut;

    public TodoServiceTests()
    {
        _sut = new TodoService(_repositoryMock.Object);
    }

    // --- GetAllAsync ---


    [Fact]
    public async Task GetAllAsyncReturnsAllTodos()
    {
        List<Todo> todos = new List<Todo>
        {
            new() { Id = 1, Text = "タスク1", Completed = false, CreatedAt = DateTime.UtcNow },
            new() { Id = 2, Text = "タスク2", Completed = true, CreatedAt = DateTime.UtcNow },
        };
        TodoQueryParams queryParams = new TodoQueryParams();
        _repositoryMock.Setup(r => r.GetAllAsync(queryParams)).ReturnsAsync(todos);

        IEnumerable<Todo> result = await _sut.GetAllAsync(queryParams);

        Assert.Equal(2, result.Count());
    }

    // --- CreateAsync ---

    [Fact]
    public async Task CreateAsync_SetsDueDateFromRequest()
    {
        // Arrange
        DateOnly dueDate = new DateOnly(2026, 4, 30);
        CreateTodoRequest request = new CreateTodoRequest { Text = "タスク", DueDate = dueDate };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        // Act
        Todo result = await _sut.CreateAsync(request);

        // Assert
        Assert.Equal(dueDate, result.DueDate);
    }

    [Fact]
    public async Task CreateAsync_SetsDueDateToNull_WhenDueDateNotProvided()
    {
        // Arrange
        CreateTodoRequest request = new CreateTodoRequest { Text = "タスク" };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        // Act
        Todo result = await _sut.CreateAsync(request);

        // Assert
        Assert.Null(result.DueDate);
    }

    [Fact]
    public async Task CreateAsyncCreatesAndReturnsTodo()
    {
        CreateTodoRequest request = new CreateTodoRequest { Text = "新しいタスク" };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);

        Assert.Equal("新しいタスク", result.Text);
        Assert.False(result.Completed);
    }

    [Fact]
    public async Task CreateAsyncTrimsWhitespaceFromText()
    {
        CreateTodoRequest request = new CreateTodoRequest { Text = "  スペースあり  " };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);

        Assert.Equal("スペースあり", result.Text);
    }

    [Fact]
    public async Task CreateAsyncSetsCreatedAtToUtcNow()
    {
        DateTime before = DateTime.UtcNow;
        CreateTodoRequest request = new CreateTodoRequest { Text = "タスク" };
        _repositoryMock
            .Setup(r => r.CreateAsync(It.IsAny<Todo>()))
            .ReturnsAsync((Todo t) => t);

        Todo result = await _sut.CreateAsync(request);
        DateTime after = DateTime.UtcNow;

        Assert.True(result.CreatedAt >= before && result.CreatedAt <= after);
    }

    // --- UpdateAsync ---

    [Fact]
    public async Task UpdateAsyncReturnsNullWhenTodoNotFound()
    {
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<int>())).ReturnsAsync((Todo?)null);

        Todo? result = await _sut.UpdateAsync(99, new UpdateTodoRequest { Text = "更新" });

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateAsyncUpdatesTextWhenTextProvided()
    {
        Todo todo = new Todo { Id = 1, Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "更新後" });

        Assert.Equal("更新後", result!.Text);
    }

    [Fact]
    public async Task UpdateAsyncUpdatesCompletedWhenCompletedProvided()
    {
        Todo todo = new Todo { Id = 1, Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.True(result!.Completed);
    }

    [Fact]
    public async Task UpdateAsyncDoesNotChangeTextWhenTextIsNull()
    {
        Todo todo = new Todo { Id = 1, Text = "元のテキスト", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        Assert.Equal("元のテキスト", result!.Text);
    }

    [Fact]
    public async Task UpdateAsyncTrimsWhitespaceFromText()
    {
        Todo todo = new Todo { Id = 1, Text = "元", Completed = false, CreatedAt = DateTime.UtcNow };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Text = "  更新後  " });

        Assert.Equal("更新後", result!.Text);
    }

    [Fact]
    public async Task UpdateAsync_SetsDueDate_WhenDueDateProvided()
    {
        // Arrange
        DateOnly dueDate = new DateOnly(2026, 4, 30);
        Todo todo = new Todo { Id = 1, Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow, DueDate = null };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        // Act
        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { DueDate = dueDate });

        // Assert
        Assert.Equal(dueDate, result!.DueDate);
    }

    [Fact]
    public async Task UpdateAsync_ResetsDueDateToNull_WhenResetDueDateIsTrue()
    {
        // Arrange
        Todo todo = new Todo { Id = 1, Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow, DueDate = new DateOnly(2026, 4, 30) };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        // Act
        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { ResetDueDate = true });

        // Assert
        Assert.Null(result!.DueDate);
    }

    [Fact]
    public async Task UpdateAsync_DoesNotChangeDueDate_WhenNeitherFlagNorValueProvided()
    {
        // Arrange
        DateOnly originalDueDate = new DateOnly(2026, 4, 30);
        Todo todo = new Todo { Id = 1, Text = "タスク", Completed = false, CreatedAt = DateTime.UtcNow, DueDate = originalDueDate };
        _repositoryMock.Setup(r => r.GetByIdAsync(todo.Id)).ReturnsAsync(todo);
        _repositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Todo>())).ReturnsAsync((Todo t) => t);

        // Act
        Todo? result = await _sut.UpdateAsync(todo.Id, new UpdateTodoRequest { Completed = true });

        // Assert
        Assert.Equal(originalDueDate, result!.DueDate);
    }

    // --- DeleteAsync ---

    [Fact]
    public async Task DeleteAsyncReturnsFalseWhenTodoNotFound()
    {
        int id = 99;
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(false);

        bool result = await _sut.DeleteAsync(id);

        Assert.False(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    [Fact]
    public async Task DeleteAsyncReturnsTrueWhenTodoDeleted()
    {
        int id = 1;
        _repositoryMock.Setup(r => r.DeleteAsync(id)).ReturnsAsync(true);

        bool result = await _sut.DeleteAsync(id);

        Assert.True(result);
        _repositoryMock.Verify(r => r.DeleteAsync(id), Times.Once);
    }

    // --- DeleteCompletedAsync ---

    [Fact]
    public async Task DeleteCompletedAsyncCallsRepositoryDeleteCompleted()
    {
        _repositoryMock.Setup(r => r.DeleteCompletedAsync()).Returns(Task.CompletedTask);

        await _sut.DeleteCompletedAsync();

        _repositoryMock.Verify(r => r.DeleteCompletedAsync(), Times.Once);
    }
}
