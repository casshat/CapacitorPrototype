/**
 * AddFoodPage - AI-powered food entry
 * 
 * Uses GPT-4 mini to parse natural language food descriptions
 * into structured nutrition data.
 * 
 * Flow:
 * 1. User describes what they ate in natural language
 * 2. AI parses the description into structured food items
 * 3. User reviews and optionally adjusts serving sizes
 * 4. User confirms to add all items to their food log
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Check, X, UtensilsCrossed } from 'lucide-react';
import { useFoodLog } from '../context/FoodLogContext';
import { parseFoodWithAI } from '../services/api/openai';
import type { AIFoodItem, AIFoodResponse } from '../types/food';

function AddFoodPage() {
  const navigate = useNavigate();
  const { addFoodsFromAI } = useFoodLog();

  // Input state
  const [input, setInput] = useState('');
  
  // AI response state
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIFoodResponse | null>(null);
  const [editableFoods, setEditableFoods] = useState<AIFoodItem[]>([]);
  
  // Track which items are selected for adding
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const handleBack = () => {
    navigate('/log');
  };

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);
    setEditableFoods([]);

    try {
      const result = await parseFoodWithAI(input.trim());
      setResponse(result);
      
      if (result.foods && result.foods.length > 0) {
        setEditableFoods(result.foods);
        // Select all items by default
        setSelectedIds(new Set(result.foods.map((_, i) => i)));
      }
    } catch (error) {
      console.error('Error parsing food:', error);
      setResponse({
        foods: [],
        error: 'Something went wrong',
        suggestion: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSelect = (index: number) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleRemoveFood = (index: number) => {
    setEditableFoods(prev => prev.filter((_, i) => i !== index));
    setSelectedIds(prev => {
      const newSet = new Set<number>();
      prev.forEach(i => {
        if (i < index) newSet.add(i);
        else if (i > index) newSet.add(i - 1);
      });
      return newSet;
    });
  };

  const handleUpdateAmount = (index: number, newAmount: number) => {
    if (newAmount <= 0) return;
    
    setEditableFoods(prev => {
      const food = prev[index];
      const ratio = newAmount / food.amount;
      
      return prev.map((f, i) => 
        i === index 
          ? {
              ...f,
              amount: newAmount,
              calories: Math.round(f.calories * ratio),
              protein: Math.round(f.protein * ratio),
              carbs: Math.round(f.carbs * ratio),
              fat: Math.round(f.fat * ratio),
            }
          : f
      );
    });
  };

  const handleAddToLog = async () => {
    const selectedFoods = editableFoods.filter((_, i) => selectedIds.has(i));
    if (selectedFoods.length === 0) return;

    await addFoodsFromAI(selectedFoods);
    navigate('/log');
  };

  const handleClear = () => {
    setInput('');
    setResponse(null);
    setEditableFoods([]);
    setSelectedIds(new Set());
  };

  // Calculate totals for selected items
  const selectedTotals = editableFoods
    .filter((_, i) => selectedIds.has(i))
    .reduce(
      (acc, food) => ({
        calories: acc.calories + food.calories,
        protein: acc.protein + food.protein,
        carbs: acc.carbs + food.carbs,
        fat: acc.fat + food.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

  const hasResults = editableFoods.length > 0;
  const hasError = response?.error;
  const hasSelectedItems = selectedIds.size > 0;

  return (
    <div className="add-food-page">
      {/* Header */}
      <header className="add-food-page__header">
        <button
          className="add-food-page__back"
          onClick={handleBack}
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="add-food-page__title">Add Food</h1>
        <div className="add-food-page__spacer" />
      </header>

      {/* Input section */}
      <div className="add-food-page__input-section">
        <div className="add-food-page__input-wrapper">
          <UtensilsCrossed size={20} className="add-food-page__input-icon" />
          <textarea
            className="add-food-page__input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="6 oz chicken breast, 1 cup cooked spinach, 1/2 cup n!ck's strawberry ice cream..."
            rows={3}
            disabled={isLoading}
          />
        </div>
        <button
          className="add-food-page__analyze-btn"
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="add-food-page__spinner" />
              Looking up...
            </>
          ) : (
            'Look-up Foods'
          )}
        </button>
      </div>

      {/* Content area */}
      <div className="add-food-page__content">
        {/* Loading state */}
        {isLoading && (
          <div className="add-food-page__loading">
            <Loader2 size={32} className="add-food-page__spinner" />
            <p>Analyzing your food...</p>
          </div>
        )}

        {/* Error state */}
        {hasError && !isLoading && (
          <div className="add-food-page__error">
            <AlertCircle size={24} />
            <p className="add-food-page__error-title">{response.error}</p>
            {response.suggestion && (
              <p className="add-food-page__error-suggestion">{response.suggestion}</p>
            )}
          </div>
        )}

        {/* Results */}
        {hasResults && !isLoading && (
          <>
            {/* Confidence badge */}
            {response?.confidence && (
              <div className={`add-food-page__confidence add-food-page__confidence--${response.confidence}`}>
                Confidence: {response.confidence}
              </div>
            )}

            {/* Notes from AI */}
            {response?.notes && (
              <p className="add-food-page__notes">{response.notes}</p>
            )}

            {/* Food items list */}
            <div className="add-food-page__results">
              <h2 className="add-food-page__section-title">PARSED FOODS</h2>
              
              {editableFoods.map((food, index) => (
                <div 
                  key={index} 
                  className={`add-food-page__food-card ${selectedIds.has(index) ? 'selected' : ''}`}
                >
                  {/* Selection checkbox */}
                  <button
                    className="add-food-page__checkbox"
                    onClick={() => handleToggleSelect(index)}
                    aria-label={selectedIds.has(index) ? 'Deselect' : 'Select'}
                  >
                    {selectedIds.has(index) && <Check size={14} />}
                  </button>

                  {/* Food info */}
                  <div className="add-food-page__food-info">
                    <span className="add-food-page__food-name">{food.name}</span>
                    <div className="add-food-page__food-amount">
                      <input
                        type="number"
                        className="add-food-page__amount-input"
                        value={food.amount}
                        onChange={(e) => handleUpdateAmount(index, parseInt(e.target.value) || 0)}
                        min="1"
                      />
                      <span className="add-food-page__unit">g</span>
                    </div>
                  </div>

                  {/* Nutrition */}
                  <div className="add-food-page__food-nutrition">
                    <span className="add-food-page__calories">{food.calories} cal</span>
                    <span className="add-food-page__macros">
                      {food.protein}p · {food.carbs}c · {food.fat}f
                    </span>
                  </div>

                  {/* Remove button */}
                  <button
                    className="add-food-page__remove"
                    onClick={() => handleRemoveFood(index)}
                    aria-label="Remove food"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Totals */}
            {hasSelectedItems && (
              <div className="add-food-page__totals">
                <span className="add-food-page__totals-label">
                  Total ({selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''})
                </span>
                <div className="add-food-page__totals-values">
                  <span className="add-food-page__totals-calories">{selectedTotals.calories} cal</span>
                  <span className="add-food-page__totals-macros">
                    {selectedTotals.protein}p · {selectedTotals.carbs}c · {selectedTotals.fat}f
                  </span>
                </div>
              </div>
            )}
          </>
        )}

      </div>

      {/* Footer with action buttons */}
      {hasResults && !isLoading && (
        <div className="add-food-page__footer">
          <button
            className="add-food-page__clear-btn"
            onClick={handleClear}
          >
            Clear
          </button>
          <button
            className="add-food-page__add-btn"
            onClick={handleAddToLog}
            disabled={!hasSelectedItems}
          >
            Add {selectedIds.size} Item{selectedIds.size !== 1 ? 's' : ''} to Log
          </button>
        </div>
      )}
    </div>
  );
}

export default AddFoodPage;
