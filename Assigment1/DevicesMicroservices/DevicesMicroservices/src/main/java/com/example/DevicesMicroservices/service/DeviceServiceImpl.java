package com.example.DevicesMicroservices.service;

import com.example.DevicesMicroservices.dto.DeviceCreationDto;
import com.example.DevicesMicroservices.dto.DeviceDto;
import com.example.DevicesMicroservices.mapper.DeviceMapper;
import com.example.DevicesMicroservices.model.Device;
import com.example.DevicesMicroservices.model.User;
import com.example.DevicesMicroservices.repository.DeviceRepository;
import com.example.DevicesMicroservices.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceServiceImpl implements DeviceService {

    @Autowired
    private final DeviceRepository deviceRepository;

    private final UserRepository userRepository;

    public DeviceServiceImpl(DeviceRepository deviceRepository, UserRepository userRepository) {
        this.deviceRepository = deviceRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    @Override
    public DeviceDto getDeviceById(Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        return DeviceMapper.toDeviceDto(device);
    }

    @Override
    public DeviceDto addDevice(DeviceCreationDto deviceDto) {
        User user = userRepository.findById(deviceDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Use the mapper to convert DTO to entity
        Device entity = DeviceMapper.toCreationEntity(deviceDto, user);

        // Save the device to the database and return the corresponding DeviceDto
        return DeviceMapper.toDeviceDto(deviceRepository.save(entity));
    }

    @Override
    public DeviceDto updateDevice(DeviceDto deviceDto) {
        Device existingDevice = deviceRepository.findById(deviceDto.getDeviceId())
                .orElseThrow(() -> new RuntimeException("Device not found"));

        // Find the user entity
        User user = userRepository.findById(deviceDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Map the DeviceDto to the Device entity, update the entity with new details
        existingDevice.setDescription(deviceDto.getDescription());
        existingDevice.setAddress(deviceDto.getAddress());
        existingDevice.setConsumption(deviceDto.getConsumption());
        existingDevice.setUser(user);
        return DeviceMapper.toDeviceDto(deviceRepository.save(existingDevice));
    }

    @Override
    public void deleteDevice(Long deviceId) {
        Device existingDevice = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new RuntimeException("Device not found"));
        deviceRepository.delete(existingDevice);
    }

    @Override
    public List<DeviceDto> getAllDevicesByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find all devices belonging to the user
        List<Device> devices = deviceRepository.findAllByUser(user);

        // Convert List of Device entities to List of DeviceDto
        return devices.stream()
                .map(DeviceMapper::toDeviceDto)
                .toList();
    }
}