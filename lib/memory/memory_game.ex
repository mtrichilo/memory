defmodule Memory.Game do
  @moduledoc """
  State logic for memory game.
  """

  @doc """
  Initializes the state for a new memory game.
  """
  def new() do
    letters = ["A", "B", "C", "D", "E", "F", "G", "H"]
    letters = Enum.shuffle(letters ++ letters)

    board = Enum.map(letters, &(%{letter: &1, matched: false, selected: false}))
    %{board: board, clicks: 0, wait: false}
  end

  def xnor(first, second) do
    (first or not second) and (not first or second)
  end

  @doc """
  State logic when a player selects a card.
  """
  def select(state, index) do
    if Enum.at(state.board, index).selected || state.wait do
      state
    else
      board = List.replace_at(state.board, index, %{Enum.at(state.board, index) | selected: true})
      update = %{board: board, clicks: state.clicks + 1, wait: state.wait}
      letter = Enum.at(update.board, index).letter
      if Enum.count(update.board, &(&1.selected)) == 2 do
        temp =
          if Enum.all?(update.board, &(xnor(&1.selected, &1.letter == letter))) do
            %{update | board: Enum.map(update.board, &(%{&1 | matched: &1.matched || &1.letter == letter}))}
          else
            update
          end
        %{temp | wait: true}
      else
        update
      end
    end
  end

  @doc """
  Flips any selected cards back over.
  """
  def flip(state) do
     %{board: Enum.map(state.board, &(%{&1 | selected: false})), clicks: state.clicks, wait: false}
  end
end
