#!/bin/bash
  ports=(3000 3001 3002 3003 3004 3005 4173 5173 5174)

  for port in "${ports[@]}"; do
    pids=$(lsof -ti tcp:"$port")
    if [ -n "$pids" ]; then
      echo "Turning off thing on port $port: $pids"
      kill $pids
    fi
  done
