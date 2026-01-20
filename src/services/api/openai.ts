/**
 * OpenAI Food Parsing Service
 * 
 * Uses GPT-4 mini to parse natural language food descriptions
 * into structured nutrition data.
 */

import type { AIFoodResponse } from '../../types/food';

// OpenAI API key from environment
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// System prompt for GPT-4 mini
const SYSTEM_PROMPT = `You are a nutrition assistant that analyzes food descriptions and returns structured nutrition data. Given a description of food the user ate, estimate the serving size and calculate accurate macronutrient values.

RESPONSE FORMAT:
You must respond with valid JSON only. No explanations, no markdown, just the JSON object.

{
  "foods": [
    {
      "name": "string - food name",
      "amount": "number - serving size in grams",
      "unit": "g",
      "calories": "number - total calories for this serving",
      "protein": "number - grams of protein",
      "carbs": "number - grams of carbohydrates", 
      "fat": "number - grams of fat"
    }
  ],
  "confidence": "high | medium | low",
  "source": "string - data source reference",
  "notes": "string - optional clarification or assumption made"
}

RULES:
1. Always use grams (g) as the unit
2. Round all numbers to integers
3. If multiple foods mentioned, return each as separate item in the "foods" array
4. Make reasonable serving size assumptions if not specified (e.g., "an apple" = ~180g medium apple)
5. If input is unclear or not food-related, return: {"error": "Could not parse food", "suggestion": "Try describing what you ate more specifically"}
6. Be accurate - use standard USDA nutritional database values as reference`;

/**
 * Parse a natural language food description using GPT-4 mini.
 * 
 * @param userInput - Natural language description of food eaten
 * @returns Parsed food data with nutrition information
 */
export async function parseFoodWithAI(userInput: string): Promise<AIFoodResponse> {
  if (!OPENAI_API_KEY) {
    return {
      foods: [],
      error: 'OpenAI API key not configured',
      suggestion: 'Please add VITE_OPENAI_API_KEY to your .env file',
    };
  }

  if (!userInput.trim()) {
    return {
      foods: [],
      error: 'No food description provided',
      suggestion: 'Please describe what you ate',
    };
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userInput },
        ],
        temperature: 0.3, // Lower temperature for more consistent results
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API error:', errorData);
      return {
        foods: [],
        error: 'Failed to analyze food',
        suggestion: 'Please try again or describe your food differently',
      };
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return {
        foods: [],
        error: 'No response from AI',
        suggestion: 'Please try again',
      };
    }

    // Parse the JSON response
    const parsed = JSON.parse(content) as AIFoodResponse;

    // Validate response structure
    if (parsed.error) {
      return parsed;
    }

    if (!parsed.foods || !Array.isArray(parsed.foods)) {
      return {
        foods: [],
        error: 'Invalid response format',
        suggestion: 'Please try describing your food again',
      };
    }

    // Ensure all numeric values are integers
    parsed.foods = parsed.foods.map(food => ({
      ...food,
      amount: Math.round(food.amount),
      calories: Math.round(food.calories),
      protein: Math.round(food.protein),
      carbs: Math.round(food.carbs),
      fat: Math.round(food.fat),
    }));

    return parsed;
  } catch (error) {
    console.error('Error parsing food with AI:', error);
    
    // Check if it's a JSON parse error
    if (error instanceof SyntaxError) {
      return {
        foods: [],
        error: 'Failed to parse AI response',
        suggestion: 'Please try again with a clearer description',
      };
    }

    return {
      foods: [],
      error: 'Network error',
      suggestion: 'Please check your connection and try again',
    };
  }
}
