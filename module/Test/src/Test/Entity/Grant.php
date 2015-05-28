<?php
namespace Test\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;

/** 
 * @ORM\Entity
 * @ORM\Table(name="GroupGrant")
 */
class Grant {
    /**
	 * @ORM\Id
	 * @ORM\GeneratedValue(strategy="AUTO")
	 * @ORM\Column(type="integer")
	 */
	protected $id;

	/** @ORM\Column(type="string", length=255, nullable=true) */
	protected $code;
	
	/** @ORM\Column(type="string", length=255) */
	protected $name;
	
	/** @ORM\Column(type="boolean", nullable=true) */
	protected $focalpoint;
	
	/** @ORM\ManyToMany(targetEntity="Queue") */
	protected $queues;
	
	public function __construct(){
		$this->queues = new ArrayCollection();
	}

	public function getId(){
	    return $this->id;
	}
    
    public function setId($id){
    	$this->id = $id;
    }

    public function getCode(){
    	return $this->code;
    }
    
    public function setCode($code){
    	$this->code = $code;
    }
    
    public function getName(){
    	return $this->name;
    }
    
    public function setName($name){
    	$this->name = $name;
    }
    
    public function isFocalpoint(){
    	return $this->focalpoint?:false;
    }
    
    public function setFocalpoint($focalpoint){
    	$this->focalpoint = $focalpoint;
    }
    
    public function getQueues(){
    	return $this->queues;
    }
    
    public function setQueues($queues){
    	$this->queues = $queues;
    }
}