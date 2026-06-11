<?php

namespace App\Services;

use App\Models\PersonaRule;

class RecommendationEngine
{
    public function calculate(array $answersTextArray): array
    {
        $scores = [
            'creator' => 0,
            'solver' => 0,
            'guardian' => 0,
            'analyst' => 0
        ];

        // Fetch all weights based on the answer text strings
        $rules = PersonaRule::whereIn('answer_text', $answersTextArray)->get();

        foreach ($rules as $rule) {
            $persona = strtolower(trim($rule->persona));
            if (isset($scores[$persona])) {
                $scores[$persona] += $rule->points;
            } else {
                $scores[$persona] = $rule->points;
            }
        }

        // Sort descending to find the winner
        arsort($scores);
        $topPersona = array_key_first($scores) ?? 'solver'; // Fallback

        return [
            'persona' => $topPersona,
            'score_breakdown' => $scores
        ];
    }
}
