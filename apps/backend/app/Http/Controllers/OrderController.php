<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    // Public: Submit an order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'customer_phone' => 'nullable|string|max:50',
            'table_number' => 'nullable|string|max:50',
            'items' => 'required|array|min:1|max:50',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
        ]);

        return DB::transaction(function () use ($validated) {
            $totalPrice = 0;
            $orderItems = [];

            foreach ($validated['items'] as $itemData) {
                $menuItem = MenuItem::findOrFail($itemData['menu_item_id']);
                
                if (!$menuItem->is_available) {
                    abort(400, "Item {$menuItem->name} is currently unavailable.");
                }

                $itemTotal = $menuItem->price * $itemData['quantity'];
                $totalPrice += $itemTotal;

                $orderItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $menuItem->price,
                ];
            }

            $order = Order::create([
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            Log::info('New order submitted', ['order_id' => $order->id, 'total' => $totalPrice, 'items_count' => count($orderItems)]);

            return response()->json([
                'message' => 'Order submitted successfully',
                'order_id' => $order->id,
                'total_price' => $totalPrice
            ], 201);
        });
    }

    // Admin: List Orders (paginated, filterable by status)
    public function index(Request $request)
    {
        $request->validate([
            'status' => 'nullable|in:pending,cleared',
        ]);

        $query = Order::with(['items.menuItem', 'clearedByAdmin']);

        if ($request->has('status')) {
            $query->where('status', $request->query('status'));
        }

        return response()->json($query->orderByDesc('created_at')->paginate(25));
    }

    // Admin: Mark as cleared
    public function markAsCleared(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->status === 'cleared') {
            return response()->json(['message' => 'Order is already cleared'], 400);
        }

        $order->update([
            'status' => 'cleared',
            'cleared_by_admin_id' => $request->user()->id,
        ]);

        Log::info('Order cleared', ['order_id' => $order->id, 'cleared_by' => $request->user()->id]);

        return response()->json([
            'message' => 'Order marked as cleared successfully',
            'order' => $order->load('clearedByAdmin')
        ]);
    }
}
