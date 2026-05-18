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

            $itemIds = collect($validated['items'])->pluck('menu_item_id');
            $menuItems = MenuItem::whereIn('id', $itemIds)->get()->keyBy('id');
            $unavailableItems = [];

            foreach ($validated['items'] as $itemData) {
                $menuItem = $menuItems->get($itemData['menu_item_id']);
                
                if (!$menuItem || !$menuItem->is_available) {
                    $unavailableItems[] = $menuItem ? $menuItem->name : 'Unknown Item';
                    continue;
                }

                $itemTotal = $menuItem->price * $itemData['quantity'];
                $totalPrice += $itemTotal;

                $orderItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $itemData['quantity'],
                    'price' => $menuItem->price,
                ];
            }

            if (count($unavailableItems) > 0) {
                return response()->json([
                    'message' => 'Some items are currently unavailable.',
                    'unavailable_items' => $unavailableItems
                ], 400);
            }

            $order = Order::create([
                'customer_name' => $validated['customer_name'] ?? null,
                'customer_phone' => $validated['customer_phone'] ?? null,
                'table_number' => $validated['table_number'] ?? null,
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            $order->items()->createMany($orderItems);

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
