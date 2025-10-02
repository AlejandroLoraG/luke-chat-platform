#!/usr/bin/env node

/**
 * Test script to verify CORS fix works with deployed backend
 */

const API_BASE = 'https://chat.alelo-luqe.fun';

console.log('🧪 Testing CORS Fix Against Deployed Backend\n');

// Test 1: Standard Chat
async function testStandardChat() {
  console.log('1️⃣  Testing Standard Chat Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/chat`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello, this is a test',
        conversation_id: 'test-conv-' + Date.now(),
        language: 'en'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log('   ✅ Standard chat works!');
    console.log('   📝 Response preview:', data.response.substring(0, 60) + '...');
    console.log('   🆔 Conversation ID:', data.conversation_id);
    console.log('   🌐 CORS headers present:', {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
    });
    return true;
  } catch (error) {
    console.log('   ❌ Standard chat failed:', error.message);
    return false;
  }
}

// Test 2: Streaming Chat
async function testStreamingChat() {
  console.log('\n2️⃣  Testing Streaming Chat Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/chat/stream`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        message: 'Hello',
        conversation_id: 'test-stream-' + Date.now(),
        language: 'en'
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }

    console.log('   ✅ Streaming connection established!');
    console.log('   🌐 CORS headers present:', {
      'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
      'access-control-allow-credentials': response.headers.get('access-control-allow-credentials')
    });

    // Read first few chunks
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let chunkCount = 0;
    let buffer = '';

    for (let i = 0; i < 5; i++) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          chunkCount++;
          if (chunkCount === 1) {
            console.log('   📦 First chunk:', line.substring(0, 50) + '...');
          }
        }
      }
    }

    reader.cancel();
    console.log('   📊 Received', chunkCount, 'chunks');
    return true;
  } catch (error) {
    console.log('   ❌ Streaming chat failed:', error.message);
    return false;
  }
}

// Test 3: Health Check
async function testHealthCheck() {
  console.log('\n3️⃣  Testing Health Check Endpoint...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/health`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    console.log('   ✅ Health check passed!');
    console.log('   🏥 Status:', data.status);
    console.log('   🔌 MCP connected:', data.mcp_server_connected);
    console.log('   🤖 Model:', data.model);
    return true;
  } catch (error) {
    console.log('   ❌ Health check failed:', error.message);
    return false;
  }
}

// Run all tests
async function runTests() {
  const results = {
    health: await testHealthCheck(),
    standard: await testStandardChat(),
    streaming: await testStreamingChat(),
  };

  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Results:');
  console.log('='.repeat(50));
  console.log('Health Check:', results.health ? '✅ PASS' : '❌ FAIL');
  console.log('Standard Chat:', results.standard ? '✅ PASS' : '❌ FAIL');
  console.log('Streaming Chat:', results.streaming ? '✅ PASS' : '❌ FAIL');

  const allPassed = Object.values(results).every(r => r);
  console.log('\n🎯 Overall:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');

  if (allPassed) {
    console.log('\n✨ CORS fix is working correctly!');
    console.log('🚀 Ready to deploy to production.');
  }

  process.exit(allPassed ? 0 : 1);
}

runTests();
