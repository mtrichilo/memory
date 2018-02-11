defmodule Memory.Game do
  @moduledoc """
  State logic for memory game.
  """
  use Agent

  @doc """
  Starts a new memory game.
  """
  def start_link(_options) do
    Agent.start_link(&init/0, __MODULE__)
  end

  @doc """
  Initializes the state for a new memory game.
  """
  def init() do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    letters = Enum.shuffle(letters ++ letters)

    board = Enum.map(letters, &(%{letter: &1, matched: false, selected: false}))
    state = %{board: board, clicks: 0, wait: false}
  end

  @doc """
  State logic when a player selects a card.
  """
  def select(index) do
    Agent.get_and_update(__MODULE__, fn state ->
      if state[:board][index].selected || state[:wait] do
        {state, state}
      else
        new_state = state
        new_state[:board][index].selected = true
        new_state[:clicks] = new_state[:clicks] + 1
        selected = Enum.filter(new_state[:board], fn card -> card[:selected] end)
        if length(selected) == 2 do
          new_state[:wait] = true
          if selected[0][:letter] == selected[1][:letter] do
            Enum.each(selected, fn card -> card[:matched] = true end)
          end
          Enum.each(selected, fn card -> card[:selected] = false end)
        end
        {state, new_state}
      end
    end
  end

end
