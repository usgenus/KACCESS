<?php
/**
 * Supabase Cloud Database Client for Healthcare Access Portal CMS
 */

class SupabaseClient {
    private $url;
    private $key;

    public function __construct($url, $key) {
        $this->url = rtrim($url, '/');
        $this->key = $key;
    }

    public function isConfigured() {
        return !empty($this->url) && !empty($this->key) && strpos($this->url, 'supabase.co') !== false;
    }

    private function request($endpoint, $method = 'GET', $data = null, $headers = []) {
        $ch = curl_init($this->url . '/rest/v1/' . ltrim($endpoint, '/'));
        
        $reqHeaders = [
            'apikey: ' . $this->key,
            'Authorization: Bearer ' . $this->key,
            'Content-Type: application/json',
            'Prefer: return=representation'
        ];
        $reqHeaders = array_merge($reqHeaders, $headers);

        curl_setopt($ch, CURLOPT_HTTPHEADER, $reqHeaders);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 10);

        if ($method === 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        } elseif ($method === 'PUT' || $method === 'PATCH' || $method === 'DELETE') {
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
            if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        $res = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $json = json_decode($res, true);
        return [
            'status' => $httpCode,
            'data' => $json,
            'raw' => $res
        ];
    }

    // Get all items from a table
    public function selectAll($table, $orderBy = 'order.asc') {
        $endpoint = $table . '?select=*';
        if ($orderBy) {
            $endpoint .= '&order=' . $orderBy;
        }
        $res = $this->request($endpoint, 'GET');
        return $res['status'] >= 200 && $res['status'] < 300 ? $res['data'] : null;
    }

    // Insert or Upsert item
    public function upsert($table, $record, $conflictKey = 'id') {
        $endpoint = $table . ($conflictKey ? '?on_conflict=' . urlencode($conflictKey) : '');
        return $this->request($endpoint, 'POST', $record, ['Prefer: resolution=merge-duplicates,return=representation']);
    }

    // Delete item by ID
    public function delete($table, $id, $keyField = 'id') {
        return $this->request($table . '?' . urlencode($keyField) . '=eq.' . urlencode($id), 'DELETE');
    }
}
