/**
 * FoodLogRow - Display a single logged food entry
 * 
 * Shows:
 * - Food name
 * - Serving size and calories
 * - Macro breakdown (p/c/f)
 * - Delete button
 */

import { X } from 'lucide-react';
import type { FoodLogEntry } from '../../types/food';
import { formatWeight } from '../../utils/units';

interface FoodLogRowProps {
  food: FoodLogEntry;
  onDelete: (id: string) => void;
}

function FoodLogRow({ food, onDelete }: FoodLogRowProps) {
  const handleDelete = () => {
    onDelete(food.id);
  };

  return (
    <div className="food-log-row">
      {/* Left side: food info */}
      <div className="food-log-row__info">
        <div className="food-log-row__header">
          <span className="food-log-row__name">{food.name}</span>
        </div>
        <span className="food-log-row__details">
          {formatWeight(food.amount, food.unit)} · {food.calories} cal
        </span>
      </div>
      
      {/* Right side: macros and delete */}
      <div className="food-log-row__actions">
        <span className="food-log-row__macros">
          {food.protein}p · {food.carbs}c · {food.fat}f
        </span>
        <button
          className="food-log-row__delete"
          onClick={handleDelete}
          aria-label="Delete food entry"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

export default FoodLogRow;
